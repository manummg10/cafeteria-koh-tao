using Microsoft.EntityFrameworkCore;
using KohTaoBack.Data;
using KohTaoBack.DTOs;
using KohTaoBack.Models;
using KohTaoBack.Services.Email;

namespace KohTaoBack.Services
{
    public enum ResultadoUsuario { Ok, NoEncontrado, EmailDuplicado, NoPermitido }

    public interface IUsuarioService
    {
        Task<IReadOnlyList<UsuarioDto>> ListarAsync(CancellationToken ct);
        Task<(ResultadoUsuario Resultado, UsuarioDto? Usuario)> CrearAsync(CrearUsuarioRequest req, CancellationToken ct);
        Task<ResultadoUsuario> RestablecerPasswordAsync(int id, string passwordTemporal, CancellationToken ct);
        Task<ResultadoUsuario> EliminarAsync(int id, int actorId, CancellationToken ct);
    }

    public class UsuarioService : IUsuarioService
    {
        private readonly ApplicationDbContext _context;
        private readonly IAvisosSeguridad _avisos;
        private readonly ILogger<UsuarioService> _logger;

        public UsuarioService(ApplicationDbContext context, IAvisosSeguridad avisos, ILogger<UsuarioService> logger)
        {
            _context = context;
            _avisos = avisos;
            _logger = logger;
        }

        public async Task<IReadOnlyList<UsuarioDto>> ListarAsync(CancellationToken ct) =>
            await _context.Usuarios.AsNoTracking()
                .OrderBy(u => u.Rol).ThenBy(u => u.Email)
                .Select(u => new UsuarioDto(u.Id, u.Email, u.Rol, u.DebeCambiarPassword, u.UltimoAccesoUtc, u.BloqueadoHastaUtc, u.CreadoEnUtc))
                .ToListAsync(ct);

        public async Task<(ResultadoUsuario, UsuarioDto?)> CrearAsync(CrearUsuarioRequest req, CancellationToken ct)
        {
            var email = req.Email.Trim().ToLowerInvariant();
            if (await _context.Usuarios.AnyAsync(u => u.Email == email, ct))
                return (ResultadoUsuario.EmailDuplicado, null);

            var usuario = new Usuario
            {
                Email = email,
                Rol = req.Rol,
                PasswordHash = PasswordPolicy.Hash(req.PasswordTemporal),
                DebeCambiarPassword = true
            };
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync(ct);

            _logger.LogInformation("Usuario {UsuarioId} creado con rol {Rol}", usuario.Id, usuario.Rol);
            return (ResultadoUsuario.Ok, new UsuarioDto(usuario.Id, usuario.Email, usuario.Rol, true, null, null, usuario.CreadoEnUtc));
        }

        public async Task<ResultadoUsuario> RestablecerPasswordAsync(int id, string passwordTemporal, CancellationToken ct)
        {
            var usuario = await _context.Usuarios.FindAsync([id], ct);
            if (usuario is null) return ResultadoUsuario.NoEncontrado;

            usuario.PasswordHash = PasswordPolicy.Hash(passwordTemporal);
            usuario.DebeCambiarPassword = true;
            usuario.VersionSesion++;          // expulsa las sesiones abiertas
            usuario.IntentosFallidos = 0;     // y lo desbloquea si estaba bloqueado
            usuario.BloqueadoHastaUtc = null;
            await _context.SaveChangesAsync(ct);

            _avisos.PasswordRestablecida(usuario);
            _logger.LogInformation("Contraseña restablecida para el usuario {UsuarioId}", id);
            return ResultadoUsuario.Ok;
        }

        public async Task<ResultadoUsuario> EliminarAsync(int id, int actorId, CancellationToken ct)
        {
            if (id == actorId) return ResultadoUsuario.NoPermitido; // nadie puede borrarse a sí mismo

            var usuario = await _context.Usuarios.FindAsync([id], ct);
            if (usuario is null) return ResultadoUsuario.NoEncontrado;

            // Siempre debe quedar al menos un desarrollador
            if (usuario.Rol == Roles.Desarrollador &&
                await _context.Usuarios.CountAsync(u => u.Rol == Roles.Desarrollador, ct) <= 1)
                return ResultadoUsuario.NoPermitido;

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync(ct);
            _logger.LogInformation("Usuario {UsuarioId} eliminado por {ActorId}", id, actorId);
            return ResultadoUsuario.Ok;
        }
    }
}
