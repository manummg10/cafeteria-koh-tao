using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KohTaoBack.Models
{
    [Table("Reservas")] // Asegura que EF busque la tabla con "R" mayúscula
    public class Reserva
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Cliente { get; set; } = string.Empty;

        [Required]
        public int Personas { get; set; }

        [StringLength(20)]
        public string? Telefono { get; set; }

        [Required]
        public DateTime FechaHora { get; set; }

        [Required]
        public int IdMesa { get; set; }
    }
}