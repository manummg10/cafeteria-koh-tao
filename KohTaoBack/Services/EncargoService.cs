using Microsoft.EntityFrameworkCore;
using KohTaoBack.Data;
using KohTaoBack.DTOs;
using KohTaoBack.Models;

namespace KohTaoBack.Services
{
    public enum ResultadoEncargo { Ok, NoEncontrado, Invalido }

    public record ResultadoGuardarEncargo(ResultadoEncargo Resultado, EncargoDto? Encargo = null, string? Error = null);

    public interface IEncargoService
    {
        Task<IReadOnlyList<EncargoDto>> ListarAsync(bool incluirAntiguos, CancellationToken ct);
        Task<ResultadoGuardarEncargo> CrearAsync(EncargoGuardarDto dto, CancellationToken ct);
        Task<ResultadoGuardarEncargo> ActualizarAsync(int id, EncargoGuardarDto dto, CancellationToken ct);
        Task<bool> CambiarEstadoAsync(int id, string estado, CancellationToken ct);
        Task<bool> EliminarAsync(int id, CancellationToken ct);
    }

    public class EncargoService : IEncargoService
    {
        public const int DiasHistorico = 30;

        private readonly ApplicationDbContext _context;

        public EncargoService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Por defecto: encargos futuros y de los últimos 30 días (el histórico completo, bajo petición)
        public async Task<IReadOnlyList<EncargoDto>> ListarAsync(bool incluirAntiguos, CancellationToken ct)
        {
            var desde = DateTime.Today.AddDays(-DiasHistorico);
            var query = _context.Encargos.AsNoTracking();
            if (!incluirAntiguos) query = query.Where(e => e.FechaRecogida >= desde);

            var encargos = await query.Include(e => e.Lineas).OrderBy(e => e.FechaRecogida).ToListAsync(ct);
            return encargos.Select(ToDto).ToList();
        }

        public async Task<ResultadoGuardarEncargo> CrearAsync(EncargoGuardarDto dto, CancellationToken ct)
        {
            var encargo = new Encargo();
            var error = await AplicarAsync(encargo, dto, ct);
            if (error is not null) return new(ResultadoEncargo.Invalido, Error: error);

            _context.Encargos.Add(encargo);
            await _context.SaveChangesAsync(ct);
            return new(ResultadoEncargo.Ok, ToDto(encargo));
        }

        public async Task<ResultadoGuardarEncargo> ActualizarAsync(int id, EncargoGuardarDto dto, CancellationToken ct)
        {
            var encargo = await _context.Encargos.Include(e => e.Lineas).FirstOrDefaultAsync(e => e.Id == id, ct);
            if (encargo is null) return new(ResultadoEncargo.NoEncontrado);

            _context.EncargoLineas.RemoveRange(encargo.Lineas);
            encargo.Lineas.Clear();
            var error = await AplicarAsync(encargo, dto, ct);
            if (error is not null) return new(ResultadoEncargo.Invalido, Error: error);

            await _context.SaveChangesAsync(ct);
            return new(ResultadoEncargo.Ok, ToDto(encargo));
        }

        public async Task<bool> CambiarEstadoAsync(int id, string estado, CancellationToken ct) =>
            await _context.Encargos.Where(e => e.Id == id)
                .ExecuteUpdateAsync(s => s.SetProperty(e => e.Estado, estado), ct) > 0;

        public async Task<bool> EliminarAsync(int id, CancellationToken ct)
        {
            var encargo = await _context.Encargos.FindAsync([id], ct);
            if (encargo is null) return false;

            _context.Encargos.Remove(encargo); // las líneas se borran en cascada
            await _context.SaveChangesAsync(ct);
            return true;
        }

        // Valida el contenido y toma nombre/precio del catálogo (nunca del cliente). Devuelve un error legible o null.
        private async Task<string?> AplicarAsync(Encargo encargo, EncargoGuardarDto dto, CancellationToken ct)
        {
            if (dto.Lineas.Count == 0 && string.IsNullOrWhiteSpace(dto.Notas))
                return "Añade al menos un producto o describe el encargo en las notas.";

            var idsProductos = dto.Lineas.Where(l => l.Tipo == TiposLineaEncargo.Producto).Select(l => l.ProductoId).Distinct().ToList();
            var idsTartas = dto.Lineas.Where(l => l.Tipo == TiposLineaEncargo.Tarta).Select(l => l.ProductoId).Distinct().ToList();

            var productos = await _context.Productos.AsNoTracking()
                .Where(p => idsProductos.Contains(p.Id)).ToDictionaryAsync(p => p.Id, p => (p.Nombre, p.Precio), ct);
            var tartas = await _context.TartasEspeciales.AsNoTracking()
                .Where(t => idsTartas.Contains(t.Id)).ToDictionaryAsync(t => t.Id, t => (t.Nombre, t.Precio), ct);

            var lineas = new List<EncargoLinea>();
            foreach (var l in dto.Lineas)
            {
                var catalogo = l.Tipo == TiposLineaEncargo.Producto ? productos : tartas;
                if (!catalogo.TryGetValue(l.ProductoId, out var item))
                    return "Alguno de los productos ya no existe en la carta. Revisa el encargo.";

                lineas.Add(new EncargoLinea
                {
                    Tipo = l.Tipo,
                    ProductoId = l.ProductoId,
                    Nombre = item.Nombre,
                    PrecioUnitario = item.Precio,
                    Cantidad = l.Cantidad
                });
            }

            encargo.Cliente = dto.Cliente.Trim();
            encargo.Telefono = dto.Telefono.Trim();
            encargo.Email = string.IsNullOrWhiteSpace(dto.Email) ? null : dto.Email.Trim().ToLowerInvariant();
            encargo.FechaRecogida = dto.FechaRecogida;
            encargo.Notas = string.IsNullOrWhiteSpace(dto.Notas) ? null : dto.Notas.Trim();
            encargo.Lineas.AddRange(lineas);
            encargo.Total = lineas.Sum(x => x.PrecioUnitario * x.Cantidad);
            return null;
        }

        private static EncargoDto ToDto(Encargo e) => new(
            e.Id, e.Cliente, e.Telefono, e.Email, e.FechaRecogida, e.Notas, e.Estado, e.Total, e.CreadoEnUtc,
            e.Lineas.Select(l => new EncargoLineaDto(l.Tipo, l.ProductoId, l.Nombre, l.PrecioUnitario, l.Cantidad)).ToList());
    }
}
