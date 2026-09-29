using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using KohTaoBack.Controllers;
using KohTaoBack.Data;
using KohTaoBack.Models;
using KohTaoBack.Options;
using KohTaoBack.Services;
using KohTaoBack.Services.Email;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

// ⚙️ Opciones tipadas (secretos vía User Secrets en desarrollo / variables de entorno en producción)
builder.Services.AddOptions<JwtOptions>().Bind(config.GetSection(JwtOptions.Seccion)).ValidateDataAnnotations().ValidateOnStart();
builder.Services.Configure<SmtpOptions>(config.GetSection(SmtpOptions.Seccion));
builder.Services.Configure<AdminSeedOptions>(config.GetSection(AdminSeedOptions.Seccion));
builder.Services.Configure<SeguridadLoginOptions>(config.GetSection(SeguridadLoginOptions.Seccion));

// 🔌 Base de datos (MySQL / MariaDB vía Pomelo)
var connectionString = config.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Falta ConnectionStrings:DefaultConnection (User Secrets o variable de entorno).");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, DatabaseConfig.ParseServerVersion(config)));

// 🧩 Servicios de negocio
builder.Services.AddScoped<IProductoService, ProductoService>();
builder.Services.AddScoped<ITartaEspecialService, TartaEspecialService>();
builder.Services.AddScoped<IEncargoService, EncargoService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddSingleton<IAvisosSeguridad, AvisosSeguridad>();
builder.Services.AddSingleton<ITokenService, TokenService>();
builder.Services.AddSingleton<EmailQueue>();
builder.Services.AddSingleton<IEmailQueue>(sp => sp.GetRequiredService<EmailQueue>());
builder.Services.AddHttpClient(ResendApiEmailSender.HttpClientName, c =>
{
    c.BaseAddress = new Uri("https://api.resend.com/");
    c.Timeout = TimeSpan.FromSeconds(15);
});
builder.Services.AddSingleton<ResendApiEmailSender>();
builder.Services.AddSingleton<SmtpEmailSender>();
builder.Services.AddHostedService<EmailBackgroundService>();

// 🔐 Autenticación: JWT leído EXCLUSIVAMENTE desde la cookie HttpOnly
var jwt = config.GetSection(JwtOptions.Seccion).Get<JwtOptions>() ?? new JwtOptions();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwt.Issuer,
            ValidateAudience = true,
            ValidAudience = jwt.Audience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
            RoleClaimType = "role",
            NameClaimType = "email"
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = ctx =>
            {
                ctx.Token = ctx.Request.Cookies[jwt.CookieName];
                return Task.CompletedTask;
            },
            // Sesión revocable: usuario, rol y versión de sesión se comprueban contra la BD
            OnTokenValidated = SesionValidator.ValidarAsync
        };
    });

// 🛡️ Autorización por rol. Con contraseña temporal solo se permite /api/auth/* (cambiarla).
static bool SinPasswordTemporal(AuthorizationHandlerContext c) => !c.User.HasClaim(ClaimsSesion.DebeCambiarPassword, "true");
builder.Services.AddAuthorizationBuilder()
    .AddPolicy(Politicas.GestionCafeteria, p => p.RequireRole(Roles.Propietario, Roles.Desarrollador).RequireAssertion(SinPasswordTemporal))
    .AddPolicy(Politicas.GestionUsuarios, p => p.RequireRole(Roles.Desarrollador).RequireAssertion(SinPasswordTemporal))
    // Deny-by-default: cualquier endpoint sin atributo explícito queda solo para el Desarrollador
    .SetFallbackPolicy(new AuthorizationPolicyBuilder().RequireRole(Roles.Desarrollador).RequireAssertion(SinPasswordTemporal).Build());

// 🚦 Límite de intentos de login por IP (fuerza bruta)
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy(AuthController.PoliticaLogin, http =>
        RateLimitPartition.GetFixedWindowLimiter(
            http.Connection.RemoteIpAddress?.ToString() ?? "desconocida",
            _ => new FixedWindowRateLimiterOptions { PermitLimit = 5, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
});

// 🌐 CORS: solo si el frontend está en OTRO origen (en producción se sirve desde el mismo)
var origenesPermitidos = config.GetSection("Cors:OrigenesPermitidos").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (origenesPermitidos.Length > 0)
            policy.WithOrigins(origenesPermitidos).AllowCredentials().AllowAnyHeader().WithMethods("GET", "POST", "PUT", "DELETE");
    });
});

// 🔁 Detrás de proxies (Netlify → Render) para obtener IP y esquema reales
if (config.GetValue<bool>("Proxy:Habilitado"))
{
    builder.Services.Configure<ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
        // Solo se confía en los N saltos más a la derecha (añadidos por nuestros proxies), no en lo que envíe el cliente
        options.ForwardLimit = config.GetValue("Proxy:Saltos", 1);
        options.KnownIPNetworks.Clear(); // La app solo debe ser accesible a través del proxy
        options.KnownProxies.Clear();
    });
}

builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();

// 📦 Tamaño máximo de petición (imágenes ya llegan comprimidas a ~300 KB)
builder.WebHost.ConfigureKestrel(options => options.Limits.MaxRequestBodySize = 2 * 1024 * 1024);

var app = builder.Build();

// 🗄️ Migraciones y creación del administrador al arrancar (configurable)
if (config.GetValue<bool>("Database:MigrarAlArrancar"))
{
    using var scope = app.Services.CreateScope();
    await scope.ServiceProvider.GetRequiredService<ApplicationDbContext>().Database.MigrateAsync();
}
await AdminSeeder.EjecutarAsync(app.Services);

if (config.GetValue<bool>("Proxy:Habilitado"))
    app.UseForwardedHeaders();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    app.UseExceptionHandler(); // Respuesta ProblemDetails genérica, sin detalles internos
    app.UseHsts();
}

app.UseHttpsRedirection();

// Cabeceras de seguridad básicas
app.Use(async (context, next) =>
{
    var headers = context.Response.Headers;
    headers.XContentTypeOptions = "nosniff";
    headers.XFrameOptions = "DENY";
    headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
    await next();
});

// 🖥️ Web pública (build de React en wwwroot) servida desde el mismo origen
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGet("/health", () => Results.Ok("ok")).AllowAnonymous();
app.MapFallback("/api/{**ruta}", () => Results.NotFound()).AllowAnonymous();
app.MapFallbackToFile("index.html").AllowAnonymous();

app.Run();
