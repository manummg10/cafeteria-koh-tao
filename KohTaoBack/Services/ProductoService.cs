using Microsoft.EntityFrameworkCore;
using KohTaoBack.Data;
using KohTaoBack.DTOs;
using KohTaoBack.Models;

namespace KohTaoBack.Services
{
    public interface IProductoService
    {
        Task<IReadOnlyList<ProductoDto>> ListarAsync(CancellationToken ct);
        Task<ProductoDto> CrearAsync(ProductoGuardarDto dto, CancellationToken ct);
        Task<bool> ActualizarAsync(int id, ProductoGuardarDto dto, CancellationToken ct);
        Task<bool> EliminarAsync(int id, CancellationToken ct);
    }

    public class ProductoService : IProductoService
    {
        private readonly ApplicationDbContext _context;

        public ProductoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<ProductoDto>> ListarAsync(CancellationToken ct) =>
            await _context.Productos.AsNoTracking()
                .OrderBy(p => p.Categoria).ThenBy(p => p.Nombre)
                .Select(p => new ProductoDto(p.Id, p.Nombre, p.Precio, p.Categoria, p.Descripcion))
                .ToListAsync(ct);

        public async Task<ProductoDto> CrearAsync(ProductoGuardarDto dto, CancellationToken ct)
        {
            var producto = new Producto();
            Aplicar(producto, dto);
            _context.Productos.Add(producto);
            await _context.SaveChangesAsync(ct);
            return ToDto(producto);
        }

        public async Task<bool> ActualizarAsync(int id, ProductoGuardarDto dto, CancellationToken ct)
        {
            var producto = await _context.Productos.FindAsync([id], ct);
            if (producto is null) return false;

            Aplicar(producto, dto);
            await _context.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> EliminarAsync(int id, CancellationToken ct) =>
            await _context.Productos.Where(p => p.Id == id).ExecuteDeleteAsync(ct) > 0;

        private static void Aplicar(Producto p, ProductoGuardarDto dto)
        {
            p.Nombre = dto.Nombre.Trim();
            p.Precio = dto.Precio;
            p.Categoria = dto.Categoria.Trim();
            p.Descripcion = dto.Descripcion?.Trim();
        }

        private static ProductoDto ToDto(Producto p) => new(p.Id, p.Nombre, p.Precio, p.Categoria, p.Descripcion);
    }
}
