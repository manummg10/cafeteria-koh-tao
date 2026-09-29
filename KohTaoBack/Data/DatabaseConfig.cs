using Microsoft.EntityFrameworkCore;

namespace KohTaoBack.Data
{
    public static class DatabaseConfig
    {
        // Versión fija (evita AutoDetect, que abre conexión al arrancar). Ej: "8.0.36-mysql" o "10.11.6-mariadb".
        public static ServerVersion ParseServerVersion(IConfiguration config) =>
            ServerVersion.Parse(config["Database:ServerVersion"] ?? "8.0.36-mysql");
    }
}
