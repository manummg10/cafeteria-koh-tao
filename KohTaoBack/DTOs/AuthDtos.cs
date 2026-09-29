using System.ComponentModel.DataAnnotations;

namespace KohTaoBack.DTOs
{
    public class LoginRequest
    {
        [Required, EmailAddress, StringLength(254)]
        public string Email { get; set; } = string.Empty;

        [Required, StringLength(128)]
        public string Password { get; set; } = string.Empty;
    }

    // Nunca incluye hash ni token: el JWT viaja solo en la cookie HttpOnly.
    public record UsuarioSesionDto(string Email, string Rol);
}
