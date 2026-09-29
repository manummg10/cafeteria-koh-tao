using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using KohTaoBack.Data;
using KohTaoBack.Models;
using KohTaoBack.Options;
using KohTaoBack.Services.Email;

namespace KohTaoBack.Services
{
    public enum ResultadoLogin { Ok, CredencialesInvalidas, Bloqueado }

    public record ContextoLogin(string? Ip, string? Navegador);

    public interface IAuthService
    {
        Task<(ResultadoLogin Resultado, Usuario? Usuario)> LoginAsync(string email, string password, ContextoLogin ctx, CancellationToken ct);
    }

    public class AuthService : IAuthService
    {
        // Hash ficticio para igualar el tiempo de respuesta cuando el email no existe (evita enumeración de usuarios)
        private static readonly string HashFicticio = BCrypt.Net.BCrypt.HashPassword("koh-tao-dummy-password", 12);

        private readonly ApplicationDbContext _context;
        private readonly IEmailQueue _emails;
        private readonly SeguridadLoginOptions _seguridad;
        private readonly ILogger<AuthService> _logger;

        public AuthService(ApplicationDbContext context, IEmailQueue emails, IOptions<SeguridadLoginOptions> seguridad, ILogger<AuthService> logger)
        {
            _context = context;
            _emails = emails;
            _seguridad = seguridad.Value;
            _logger = logger;
        }

        public async Task<(ResultadoLogin, Usuario?)> LoginAsync(string email, string password, ContextoLogin ctx, CancellationToken ct)
        {
            var emailNormalizado = email.Trim().ToLowerInvariant();
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == emailNormalizado, ct);

            if (usuario is null)
            {
                BCrypt.Net.BCrypt.Verify(password, HashFicticio);
                _logger.LogWarning("Login fallido (usuario inexistente) desde {Ip}", ctx.Ip);
                return (ResultadoLogin.CredencialesInvalidas, null);
            }

            if (usuario.BloqueadoHastaUtc > DateTime.UtcNow)
            {
                _logger.LogWarning("Login rechazado: cuenta bloqueada. IP {Ip}", ctx.Ip);
                return (ResultadoLogin.Bloqueado, null);
            }

            if (!BCrypt.Net.BCrypt.Verify(password, usuario.PasswordHash))
            {
                usuario.IntentosFallidos++;
                var bloquear = usuario.IntentosFallidos >= _seguridad.MaxIntentosFallidos;
                if (bloquear)
                {
                    usuario.BloqueadoHastaUtc = DateTime.UtcNow.AddMinutes(_seguridad.MinutosBloqueo);
                    usuario.IntentosFallidos = 0;
                    _emails.Encolar(CrearAvisoBloqueo(usuario, ctx));
                }
                await _context.SaveChangesAsync(ct);
                _logger.LogWarning("Login fallido (contraseña) desde {Ip}. Bloqueo: {Bloqueo}", ctx.Ip, bloquear);
                return (bloquear ? ResultadoLogin.Bloqueado : ResultadoLogin.CredencialesInvalidas, null);
            }

            usuario.IntentosFallidos = 0;
            usuario.BloqueadoHastaUtc = null;
            usuario.UltimoAccesoUtc = DateTime.UtcNow;
            await _context.SaveChangesAsync(ct);

            _emails.Encolar(CrearAvisoAcceso(usuario, ctx));
            _logger.LogInformation("Login correcto del usuario {UsuarioId} desde {Ip}", usuario.Id, ctx.Ip);
            return (ResultadoLogin.Ok, usuario);
        }

        private EmailMensaje CrearAvisoAcceso(Usuario u, ContextoLogin ctx) => new(
            u.Email,
            "Koh Tao · Nuevo acceso al panel de administración",
            $"""
            Hola,

            Se ha iniciado sesión en el panel de administración de Koh Tao.

              Fecha y hora: {HoraLocal(DateTime.UtcNow)}
              Dirección IP: {ctx.Ip ?? "desconocida"}
              Navegador:    {Recortar(ctx.Navegador)}

            Si has sido tú, no tienes que hacer nada.
            Si NO reconoces este acceso, cambia tu contraseña inmediatamente.
            """);

        private EmailMensaje CrearAvisoBloqueo(Usuario u, ContextoLogin ctx) => new(
            u.Email,
            "Koh Tao · Cuenta bloqueada temporalmente",
            $"""
            Hola,

            Se han detectado {_seguridad.MaxIntentosFallidos} intentos fallidos de acceso al panel de Koh Tao.
            La cuenta queda bloqueada durante {_seguridad.MinutosBloqueo} minutos.

              Fecha y hora: {HoraLocal(DateTime.UtcNow)}
              Dirección IP: {ctx.Ip ?? "desconocida"}

            Si no has sido tú, alguien podría estar intentando acceder a tu cuenta.
            """);

        private string HoraLocal(DateTime utc)
        {
            try
            {
                var zona = TimeZoneInfo.FindSystemTimeZoneById(_seguridad.ZonaHoraria);
                return TimeZoneInfo.ConvertTimeFromUtc(utc, zona).ToString("dd/MM/yyyy HH:mm:ss") + $" ({_seguridad.ZonaHoraria})";
            }
            catch (TimeZoneNotFoundException)
            {
                return utc.ToString("dd/MM/yyyy HH:mm:ss") + " (UTC)";
            }
        }

        private static string Recortar(string? texto) =>
            string.IsNullOrWhiteSpace(texto) ? "desconocido" : texto.Length > 200 ? texto[..200] : texto;
    }
}
