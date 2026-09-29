using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace KohTaoBack.Data
{
    // Usado solo por "dotnet ef" (migraciones). Lee la conexión de User Secrets / variables de entorno.
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true)
                .AddUserSecrets<DesignTimeDbContextFactory>(optional: true)
                .AddEnvironmentVariables()
                .Build();

            // La cadena ficticia solo sirve para "migrations add" (no abre conexión).
            var connectionString = config.GetConnectionString("DefaultConnection")
                ?? "Server=localhost;Database=kohtao_db";

            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseMySql(connectionString, DatabaseConfig.ParseServerVersion(config))
                .Options;

            return new ApplicationDbContext(options);
        }
    }
}
