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
        public DbSet<Encargo> Encargos { get; set; } = null!;
        public DbSet<EncargoLinea> EncargoLineas { get; set; } = null!;
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

            modelBuilder.Entity<Encargo>(e =>
            {
                e.Property(x => x.Cliente).HasMaxLength(100).IsRequired();
                e.Property(x => x.Telefono).HasMaxLength(20).IsRequired();
                e.Property(x => x.Email).HasMaxLength(254);
                e.Property(x => x.Notas).HasMaxLength(1000);
                e.Property(x => x.Estado).HasMaxLength(20).IsRequired();
                e.Property(x => x.Total).HasPrecision(10, 2);
                e.HasIndex(x => x.FechaRecogida);
                e.HasIndex(x => x.Estado);
                e.HasMany(x => x.Lineas).WithOne().HasForeignKey(l => l.EncargoId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<EncargoLinea>(e =>
            {
                e.Property(l => l.Tipo).HasMaxLength(20).IsRequired();
                e.Property(l => l.Nombre).HasMaxLength(100).IsRequired();
                e.Property(l => l.PrecioUnitario).HasPrecision(10, 2);
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
