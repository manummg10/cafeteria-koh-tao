using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using KohTaoBack.Data;
using KohTaoBack.Models;

namespace KohTaoBack.Services
{
    // Valida en cada petición que la sesión sigue vigente contra la BD:
    // usuario existente, mismo rol y misma versión de sesión (cambio de contraseña => sesiones antiguas revocadas).
    public static class SesionValidator
    {
        public static async Task ValidarAsync(TokenValidatedContext ctx)
        {
            var principal = ctx.Principal;
            if (!int.TryParse(principal?.FindFirstValue("sub"), out var id) ||
                !int.TryParse(principal?.FindFirstValue(ClaimsSesion.Version), out var version))
            {
                ctx.Fail("Token sin datos de sesión.");
                return;
            }

            var db = ctx.HttpContext.RequestServices.GetRequiredService<ApplicationDbContext>();
            var usuario = await db.Usuarios.AsNoTracking()
                .Where(u => u.Id == id)
                .Select(u => new { u.VersionSesion, u.Rol, u.DebeCambiarPassword })
                .FirstOrDefaultAsync(ctx.HttpContext.RequestAborted);

            if (usuario is null || usuario.VersionSesion != version || usuario.Rol != principal!.FindFirstValue("role"))
            {
                ctx.Fail("Sesión revocada.");
                return;
            }

            // Con contraseña temporal solo puede usar /api/auth/* (las políticas bloquean el resto)
            if (usuario.DebeCambiarPassword && principal.Identity is ClaimsIdentity identidad)
                identidad.AddClaim(new Claim(ClaimsSesion.DebeCambiarPassword, "true"));
        }
    }
}
