using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace KohTaoBack.Models
{
    [Table("tartas_especiales")]
    public class TartaEspecial
    {
        [Key]
        [Column("id")]
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [Required]
        [Column("nombre")]
        [JsonPropertyName("nombre")]
        public string Nombre { get; set; } = string.Empty;

        [Column("descripcion")]
        [JsonPropertyName("descripcion")]
        public string? Descripcion { get; set; }

        [Required]
        [Column("precio")]
        [JsonPropertyName("precio")]
        public decimal Precio { get; set; }

        [Column("imagen_url")] // <--- Mapeo exacto a tu columna en HeidiSQL
        [JsonPropertyName("imagenUrl")] // <--- Así lo recibirá tu JSON en React
        public string? ImagenUrl { get; set; }
    }
}