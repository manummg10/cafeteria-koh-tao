using System.ComponentModel.DataAnnotations;

namespace KohTaoBack.DTOs
{
    public record ReservaDto(int Id, string Cliente, int Personas, string? Telefono, DateTime FechaHora, int IdMesa);

    public class ReservaGuardarDto
    {
        [Required, StringLength(100, MinimumLength = 1)]
        public string Cliente { get; set; } = string.Empty;

        [Range(1, 100)]
        public int Personas { get; set; }

        [RegularExpression(@"^[0-9+\s()-]{6,20}$", ErrorMessage = "Teléfono no válido.")]
        public string? Telefono { get; set; }

        [Required]
        public DateTime FechaHora { get; set; }

        [Range(1, 999)]
        public int IdMesa { get; set; }
    }
}
