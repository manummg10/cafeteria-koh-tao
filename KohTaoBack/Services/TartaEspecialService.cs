using Microsoft.EntityFrameworkCore;
using KohTaoBack.Data;
using KohTaoBack.DTOs;
using KohTaoBack.Models;

namespace KohTaoBack.Services
{
    public interface ITartaEspecialService
    {
        Task<IReadOnlyList<TartaEspecialDto>> ListarAsync(CancellationToken ct);
        Task<TartaEspecialDto> CrearAsync(TartaEspecialGuardarDto dto, CancellationToken ct);
        Task<bool> ActualizarAsync(int id, TartaEspecialGuardarDto dto, CancellationToken ct);
        Task<bool> EliminarAsync(int id, CancellationToken ct);
    }

    public class TartaEspecialService : ITartaEspecialService
    {
        private readonly ApplicationDbContext _context;

        public TartaEspecialService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<TartaEspecialDto>> ListarAsync(CancellationToken ct) =>
            await _context.TartasEspeciales.AsNoTracking()
                .OrderBy(t => t.Nombre)
                .Select(t => new TartaEspecialDto(t.Id, t.Nombre, t.Descripcion, t.Precio, t.ImagenUrl))
                .ToListAsync(ct);

        public async Task<TartaEspecialDto> CrearAsync(TartaEspecialGuardarDto dto, CancellationToken ct)
        {
            var tarta = new TartaEspecial();
            Aplicar(tarta, dto);
            _context.TartasEspeciales.Add(tarta);
            await _context.SaveChangesAsync(ct);
            return new TartaEspecialDto(tarta.Id, tarta.Nombre, tarta.Descripcion, tarta.Precio, tarta.ImagenUrl);
        }

        public async Task<bool> ActualizarAsync(int id, TartaEspecialGuardarDto dto, CancellationToken ct)
        {
            var tarta = await _context.TartasEspeciales.FindAsync([id], ct);
            if (tarta is null) return false;

            Aplicar(tarta, dto);
            await _context.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> EliminarAsync(int id, CancellationToken ct) =>
            await _context.TartasEspeciales.Where(t => t.Id == id).ExecuteDeleteAsync(ct) > 0;

        private static void Aplicar(TartaEspecial t, TartaEspecialGuardarDto dto)
        {
            t.Nombre = dto.Nombre.Trim();
            t.Descripcion = dto.Descripcion?.Trim();
            t.Precio = dto.Precio;
            t.ImagenUrl = string.IsNullOrWhiteSpace(dto.ImagenUrl) ? null : dto.ImagenUrl;
        }
    }
}
