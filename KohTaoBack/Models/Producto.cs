using System.ComponentModel.DataAnnotations.Schema;

namespace KohTaoBack.Models
{
    public class Producto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public string Categoria { get; set; } = string.Empty;

        // 💡 Forzamos el nombre de la columna exacta de HeidiSQL y la hacemos opcional con el '?'
        [Column("descripcion")]
        public string? Descripcion { get; set; }
    }
}