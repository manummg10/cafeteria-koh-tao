using System.ComponentModel.DataAnnotations;
using KohTaoBack.Services;

namespace KohTaoBack.DTOs
{
    public record UsuarioDto(int Id, string Email, string Rol, bool DebeCambiarPassword,
        DateTime? UltimoAccesoUtc, DateTime? BloqueadoHastaUtc, DateTime CreadoEnUtc);

    public class CrearUsuarioRequest
    {
        [Required, EmailAddress, StringLength(254)]
        public string Email { get; set; } = string.Empty;

        [Required, RegularExpression("^(Propietario|Desarrollador)$", ErrorMessage = "Rol no válido.")]
        public string Rol { get; set; } = string.Empty;

        [Required, StringLength(128, MinimumLength = PasswordPolicy.MinLongitud,
            ErrorMessage = "La contraseña temporal debe tener entre 12 y 128 caracteres.")]
        public string PasswordTemporal { get; set; } = string.Empty;
    }

    public class RestablecerPasswordRequest
    {
        [Required, StringLength(128, MinimumLength = PasswordPolicy.MinLongitud,
            ErrorMessage = "La contraseña temporal debe tener entre 12 y 128 caracteres.")]
        public string PasswordTemporal { get; set; } = string.Empty;
    }
}
