using System.ComponentModel.DataAnnotations;
using KohTaoBack.Services;

namespace KohTaoBack.DTOs
{
    public class LoginRequest
    {
        [Required, EmailAddress, StringLength(254)]
        public string Email { get; set; } = string.Empty;

        [Required, StringLength(128)]
        public string Password { get; set; } = string.Empty;
    }

    public class CambiarPasswordRequest
    {
        [Required, StringLength(128)]
        public string PasswordActual { get; set; } = string.Empty;

        [Required, StringLength(128, MinimumLength = PasswordPolicy.MinLongitud,
            ErrorMessage = "La nueva contraseña debe tener entre 12 y 128 caracteres.")]
        public string PasswordNueva { get; set; } = string.Empty;
    }

    // Nunca incluye hash ni token: el JWT viaja solo en la cookie HttpOnly.
    public record UsuarioSesionDto(string Email, string Rol, bool DebeCambiarPassword);
}
