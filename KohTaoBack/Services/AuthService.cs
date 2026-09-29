using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using KohTaoBack.Data;
using KohTaoBack.Models;
using KohTaoBack.Options;
using KohTaoBack.Services.Email;

namespace KohTaoBack.Services
{
    public enum ResultadoLogin { Ok, CredencialesInvalidas, Bloqueado }
    public enum ResultadoCambioPassword { Ok, PasswordActualIncorrecta, MismaPassword, UsuarioNoEncontrado }

    public interface IAuthService
    {
        Task<(ResultadoLogin Resultado, Usuario? Usuario)> LoginAsync(string email, string password, ContextoLogin ctx, CancellationToken ct);
        Task<(ResultadoCambioPassword Resultado, Usuario? Usuario)> CambiarPasswordAsync(int usuarioId, string actual, string nueva, ContextoLogin ctx, CancellationToken ct);
    }

    public class AuthService : IAuthService
    {
        // Hash ficticio para igualar el tiempo de respuesta cuando el email no existe (evita enumeración de usuarios)
        private static readonly string HashFicticio = PasswordPolicy.Hash("koh-tao-dummy-password");

        private readonly ApplicationDbContext _context;
        private readonly IAvisosSeguridad _avisos;
        private readonly SeguridadLoginOptions _seguridad;
        private readonly ILogger<AuthService> _logger;

        public AuthService(ApplicationDbContext context, IAvisosSeguridad avisos, IOptions<SeguridadLoginOptions> seguridad, ILogger<AuthService> logger)
        {
            _context = context;
            _avisos = avisos;
            _seguridad = seguridad.Value;
            _logger = logger;
        }

        public async Task<(ResultadoLogin, Usuario?)> LoginAsync(string email, string password, ContextoLogin ctx, CancellationToken ct)
        {
            var emailNormalizado = email.Trim().ToLowerInvariant();
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == emailNormalizado, ct);

            if (usuario is null)
            {
                PasswordPolicy.Verificar(password, HashFicticio);
                _logger.LogWarning("Login fallido (usuario inexistente) desde {Ip}", ctx.Ip);
                return (ResultadoLogin.CredencialesInvalidas, null);
            }

            if (usuario.BloqueadoHastaUtc > DateTime.UtcNow)
            {
                _logger.LogWarning("Login rechazado: cuenta bloqueada. IP {Ip}", ctx.Ip);
                return (ResultadoLogin.Bloqueado, null);
            }

            if (!PasswordPolicy.Verificar(password, usuario.PasswordHash))
            {
                usuario.IntentosFallidos++;
                var bloquear = usuario.IntentosFallidos >= _seguridad.MaxIntentosFallidos;
                if (bloquear)
                {
                    usuario.BloqueadoHastaUtc = DateTime.UtcNow.AddMinutes(_seguridad.MinutosBloqueo);
                    usuario.IntentosFallidos = 0;
                    _avisos.CuentaBloqueada(usuario, ctx);
                }
                await _context.SaveChangesAsync(ct);
                _logger.LogWarning("Login fallido (contraseña) desde {Ip}. Bloqueo: {Bloqueo}", ctx.Ip, bloquear);
                return (bloquear ? ResultadoLogin.Bloqueado : ResultadoLogin.CredencialesInvalidas, null);
            }

            usuario.IntentosFallidos = 0;
            usuario.BloqueadoHastaUtc = null;
            usuario.UltimoAccesoUtc = DateTime.UtcNow;
            await _context.SaveChangesAsync(ct);

            _avisos.AccesoCorrecto(usuario, ctx);
            _logger.LogInformation("Login correcto del usuario {UsuarioId} desde {Ip}", usuario.Id, ctx.Ip);
            return (ResultadoLogin.Ok, usuario);
        }

        public async Task<(ResultadoCambioPassword, Usuario?)> CambiarPasswordAsync(int usuarioId, string actual, string nueva, ContextoLogin ctx, CancellationToken ct)
        {
            var usuario = await _context.Usuarios.FindAsync([usuarioId], ct);
            if (usuario is null) return (ResultadoCambioPassword.UsuarioNoEncontrado, null);

            if (!PasswordPolicy.Verificar(actual, usuario.PasswordHash))
            {
                _logger.LogWarning("Cambio de contraseña rechazado (actual incorrecta) para {UsuarioId}", usuarioId);
                return (ResultadoCambioPassword.PasswordActualIncorrecta, null);
            }

            if (actual == nueva) return (ResultadoCambioPassword.MismaPassword, null);

            usuario.PasswordHash = PasswordPolicy.Hash(nueva);
            usuario.DebeCambiarPassword = false;
            usuario.VersionSesion++; // cierra el resto de sesiones abiertas
            await _context.SaveChangesAsync(ct);

            _avisos.PasswordCambiada(usuario, ctx);
            _logger.LogInformation("Contraseña cambiada por el usuario {UsuarioId}", usuarioId);
            return (ResultadoCambioPassword.Ok, usuario);
        }
    }
}
