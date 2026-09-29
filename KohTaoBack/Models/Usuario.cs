namespace KohTaoBack.Models
{
    public static class Roles
    {
        public const string Admin = "Admin";
    }

    public class Usuario
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty; // BCrypt (incluye salt)
        public string Rol { get; set; } = Roles.Admin;

        // Protección contra fuerza bruta
        public int IntentosFallidos { get; set; }
        public DateTime? BloqueadoHastaUtc { get; set; }

        public DateTime CreadoEnUtc { get; set; } = DateTime.UtcNow;
        public DateTime? UltimoAccesoUtc { get; set; }
    }
}
