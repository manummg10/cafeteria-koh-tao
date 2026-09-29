namespace KohTaoBack.Models
{
    public static class EstadosEncargo
    {
        public const string Pendiente = "Pendiente";
        public const string Confirmado = "Confirmado";
        public const string Listo = "Listo";
        public const string Entregado = "Entregado";
        public const string Cancelado = "Cancelado";

        public const string PatronValidacion = "^(Pendiente|Confirmado|Listo|Entregado|Cancelado)$";
    }

    public static class TiposLineaEncargo
    {
        public const string Producto = "Producto"; // de la carta (tabla Productos)
        public const string Tarta = "Tarta";       // tartas especiales

        public const string PatronValidacion = "^(Producto|Tarta)$";
    }

    public class Encargo
    {
        public int Id { get; set; }
        public string Cliente { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string? Email { get; set; }
        public DateTime FechaRecogida { get; set; }
        public string? Notas { get; set; }
        public string Estado { get; set; } = EstadosEncargo.Pendiente;
        public decimal Total { get; set; }
        public DateTime CreadoEnUtc { get; set; } = DateTime.UtcNow;

        public List<EncargoLinea> Lineas { get; set; } = [];
    }

    // Copia de nombre y precio en el momento del encargo: cambios posteriores en la carta no alteran el histórico
    public class EncargoLinea
    {
        public int Id { get; set; }
        public int EncargoId { get; set; }
        public string Tipo { get; set; } = TiposLineaEncargo.Producto;
        public int ProductoId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public decimal PrecioUnitario { get; set; }
        public int Cantidad { get; set; }
    }
}
