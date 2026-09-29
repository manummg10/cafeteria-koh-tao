using System.ComponentModel.DataAnnotations;

namespace KohTaoBack.Options
{
    public class JwtOptions
    {
        public const string Seccion = "Jwt";

        [Required, MinLength(32)]
        public string Key { get; set; } = string.Empty;
        public string Issuer { get; set; } = "KohTaoBack";
        public string Audience { get; set; } = "KohTaoFront";

        [Range(5, 1440)]
        public int ExpiraMinutos { get; set; } = 480;
        public string CookieName { get; set; } = "kohtao_auth";
    }

    public class SmtpOptions
    {
        public const string Seccion = "Smtp";

        public string Host { get; set; } = string.Empty;
        public int Port { get; set; } = 587;
        public string Usuario { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Remitente { get; set; } = string.Empty;
        public string RemitenteNombre { get; set; } = "Koh Tao Cafetería";

        public bool Configurado => !string.IsNullOrWhiteSpace(Host) && !string.IsNullOrWhiteSpace(Remitente);
    }

    public class AdminSeedOptions
    {
        public const string Seccion = "AdminSeed";

        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    public class SeguridadLoginOptions
    {
        public const string Seccion = "SeguridadLogin";

        public int MaxIntentosFallidos { get; set; } = 5;
        public int MinutosBloqueo { get; set; } = 15;
        public string ZonaHoraria { get; set; } = "Europe/Madrid";
    }
}
