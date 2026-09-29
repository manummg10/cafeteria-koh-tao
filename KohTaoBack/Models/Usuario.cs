namespace KohTaoBack.Models
{
    public static class Roles
    {
        public const string Propietario = "Propietario";     // Dueño: carta, tartas y reservas
        public const string Desarrollador = "Desarrollador"; // Acceso total + gestión de usuarios

        public static readonly string[] Todos = [Propietario, Desarrollador];
    }

    public static class Politicas
    {
        public const string GestionCafeteria = "GestionCafeteria";
        public const string GestionUsuarios = "GestionUsuarios";
    }

    public static class ClaimsSesion
    {
        public const string Version = "ver";
        public const string DebeCambiarPassword = "debe_cambiar_password";
    }

    public class Usuario
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty; // BCrypt (incluye salt)
        public string Rol { get; set; } = Roles.Propietario;

        // Se incrementa al cambiar/restablecer la contraseña: invalida todas las sesiones anteriores
        public int VersionSesion { get; set; }

        // Contraseña temporal asignada por el desarrollador: obliga a cambiarla al entrar
        public bool DebeCambiarPassword { get; set; }

        // Protección contra fuerza bruta
        public int IntentosFallidos { get; set; }
        public DateTime? BloqueadoHastaUtc { get; set; }

        public DateTime CreadoEnUtc { get; set; } = DateTime.UtcNow;
        public DateTime? UltimoAccesoUtc { get; set; }
    }
}
