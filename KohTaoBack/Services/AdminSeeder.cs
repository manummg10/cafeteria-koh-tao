using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using KohTaoBack.Data;
using KohTaoBack.Models;
using KohTaoBack.Options;

namespace KohTaoBack.Services
{
    // Crea la cuenta del propietario solo si no existe ningún usuario.
    // Credenciales desde variables de entorno (AdminSeed__Email / AdminSeed__Password), nunca en código.
    public static class AdminSeeder
    {
        public const int MinLongitudPassword = 12;

        public static async Task EjecutarAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var seed = scope.ServiceProvider.GetRequiredService<IOptions<AdminSeedOptions>>().Value;
            var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger(nameof(AdminSeeder));

            if (await context.Usuarios.AnyAsync()) return;

            if (string.IsNullOrWhiteSpace(seed.Email) || string.IsNullOrWhiteSpace(seed.Password))
            {
                logger.LogWarning("No hay administrador creado. Define AdminSeed__Email y AdminSeed__Password para crearlo.");
                return;
            }

            if (seed.Password.Length < MinLongitudPassword)
                throw new InvalidOperationException($"AdminSeed:Password debe tener al menos {MinLongitudPassword} caracteres.");

            context.Usuarios.Add(new Usuario
            {
                Email = seed.Email.Trim().ToLowerInvariant(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(seed.Password, workFactor: 12),
                Rol = Roles.Admin
            });
            await context.SaveChangesAsync();
            logger.LogInformation("Administrador creado. Elimina ahora AdminSeed__Password de la configuración.");
        }
    }
}
