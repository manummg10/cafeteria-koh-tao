using System.ComponentModel.DataAnnotations;

namespace KohTaoBack.DTOs
{
    // --- Productos de la carta ---
    public record ProductoDto(int Id, string Nombre, decimal Precio, string Categoria, string? Descripcion);

    public class ProductoGuardarDto
    {
        [Required, StringLength(100, MinimumLength = 1)]
        public string Nombre { get; set; } = string.Empty;

        [Range(0, 9999.99)]
        public decimal Precio { get; set; }

        [Required, StringLength(50, MinimumLength = 1)]
        public string Categoria { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Descripcion { get; set; }
    }

    // --- Tartas especiales ---
    public record TartaEspecialDto(int Id, string Nombre, string? Descripcion, decimal Precio, string? ImagenUrl);

    public class TartaEspecialGuardarDto
    {
        public const int MaxImagenLength = 600_000;

        [Required, StringLength(100, MinimumLength = 1)]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Descripcion { get; set; }

        [Range(0, 9999.99)]
        public decimal Precio { get; set; }

        // Solo imágenes raster en Base64 o URLs https (evita "javascript:" y SVG con scripts)
        [StringLength(MaxImagenLength)]
        [RegularExpression(@"^(data:image/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+|https://\S+)$",
            ErrorMessage = "Formato de imagen no permitido.")]
        public string? ImagenUrl { get; set; }
    }
}
