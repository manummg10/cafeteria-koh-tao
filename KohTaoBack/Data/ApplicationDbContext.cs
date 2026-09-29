using Microsoft.EntityFrameworkCore;
using KohTaoBack.Models;

namespace KohTaoBack.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Producto> Productos { get; set; } = null!;
        public DbSet<Reserva> Reservas { get; set; } = null!;
        public DbSet<TartaEspecial> TartasEspeciales { get; set; } = null!;
        public DbSet<Usuario> Usuarios { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Producto>(e =>
            {
                e.Property(p => p.Nombre).HasMaxLength(100).IsRequired();
                e.Property(p => p.Categoria).HasMaxLength(50).IsRequired();
                e.Property(p => p.Precio).HasPrecision(10, 2);
                e.Property(p => p.Descripcion).HasMaxLength(1000);
                e.HasIndex(p => p.Categoria);
            });

            modelBuilder.Entity<TartaEspecial>(e =>
            {
                e.Property(t => t.Nombre).HasMaxLength(100).IsRequired();
                e.Property(t => t.Descripcion).HasMaxLength(1000);
                e.Property(t => t.Precio).HasPrecision(10, 2);
                e.Property(t => t.ImagenUrl).HasColumnType("mediumtext"); // Base64 comprimido (~400 KB máx.)
            });

            modelBuilder.Entity<Reserva>(e =>
            {
                e.HasIndex(r => r.FechaHora);
                e.HasIndex(r => r.IdMesa);
            });

            modelBuilder.Entity<Usuario>(e =>
            {
                e.ToTable("Usuarios");
                e.Property(u => u.Email).HasMaxLength(254).IsRequired();
                e.Property(u => u.PasswordHash).HasMaxLength(100).IsRequired();
                e.Property(u => u.Rol).HasMaxLength(20).IsRequired();
                e.HasIndex(u => u.Email).IsUnique();
            });
        }
    }
}
