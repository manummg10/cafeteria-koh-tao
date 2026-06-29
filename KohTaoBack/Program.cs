using Microsoft.EntityFrameworkCore;
using KohTaoBack.Data;

var builder = WebApplication.CreateBuilder(args);

// 🔌 Configuración de la conexión a MySQL con Pomelo
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// 🛠️ Habilitamos controladores con opciones para ignorar mayúsculas/minúsculas en el JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// 📦 Configuramos el límite de tamaño para el lector de formularios/cuerpos HTTP
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = int.MaxValue;
    options.MemoryBufferThreshold = int.MaxValue;
});

// 🔒 Configuración de políticas de CORS (Permite que React se conecte desde su puerto)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 🚀 Soporte para OpenAPI / Swagger (.NET 9+)
builder.Services.AddOpenApi();

// 🖥️ Configuramos el servidor Kestrel para aceptar peticiones de hasta 50MB (Ej: Tartas en Base64)
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 52428800; // 50 MB
});

var app = builder.Build();

// 🌐 Configuración del pipeline de peticiones HTTP
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// ⚠️ El orden de los Middlewares es vital: Primero CORS, luego autorización, luego controladores
app.UseCors("AllowAll");

app.UseAuthorization(); // <-- AÑADIDO: Evita problemas de enrutamiento y seguridad base

// 🗺️ Mapeamos las rutas de los controladores (Reservas, Productos, Tartas)
app.MapControllers();

// Endpoint del clima por defecto (Opcional)
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}