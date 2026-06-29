using Microsoft.EntityFrameworkCore;
using KohTaoBack.Models; // <-- Esta línea es vital para que reconozca 'TartaEspecial'

namespace KohTaoBack.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Producto> Productos { get; set; } = null!;
        public DbSet<Reserva> Reservas { get; set; } = null!;
        public DbSet<TartaEspecial> TartasEspeciales { get; set; } = null!; // <-- Ahora ya sabrá qué es esto
    }
}