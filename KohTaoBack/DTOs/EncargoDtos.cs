using System.ComponentModel.DataAnnotations;
using KohTaoBack.Models;

namespace KohTaoBack.DTOs
{
    public record EncargoLineaDto(string Tipo, int ProductoId, string Nombre, decimal PrecioUnitario, int Cantidad);

    public record EncargoDto(int Id, string Cliente, string Telefono, string? Email, DateTime FechaRecogida,
        string? Notas, string Estado, decimal Total, DateTime CreadoEnUtc, IReadOnlyList<EncargoLineaDto> Lineas);

    public class EncargoLineaGuardarDto
    {
        [Required, RegularExpression(TiposLineaEncargo.PatronValidacion, ErrorMessage = "Tipo de producto no válido.")]
        public string Tipo { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int ProductoId { get; set; }

        [Range(1, 99, ErrorMessage = "La cantidad debe estar entre 1 y 99.")]
        public int Cantidad { get; set; }
    }

    // Los precios NO se reciben del cliente: el servidor los toma de la carta
    public class EncargoGuardarDto
    {
        [Required, StringLength(100, MinimumLength = 1)]
        public string Cliente { get; set; } = string.Empty;

        [Required, RegularExpression(@"^[0-9+\s()-]{6,20}$", ErrorMessage = "Teléfono no válido.")]
        public string Telefono { get; set; } = string.Empty;

        [EmailAddress(ErrorMessage = "Email no válido."), StringLength(254)]
        public string? Email { get; set; }

        [Required]
        public DateTime FechaRecogida { get; set; }

        [StringLength(1000)]
        public string? Notas { get; set; }

        [MaxLength(30, ErrorMessage = "Máximo 30 productos por encargo.")]
        public List<EncargoLineaGuardarDto> Lineas { get; set; } = [];
    }

    public class CambiarEstadoEncargoDto
    {
        [Required, RegularExpression(EstadosEncargo.PatronValidacion, ErrorMessage = "Estado no válido.")]
        public string Estado { get; set; } = string.Empty;
    }
}
