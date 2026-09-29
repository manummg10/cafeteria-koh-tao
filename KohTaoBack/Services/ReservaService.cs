using Microsoft.EntityFrameworkCore;
using KohTaoBack.Data;
using KohTaoBack.DTOs;
using KohTaoBack.Models;

namespace KohTaoBack.Services
{
    public interface IReservaService
    {
        Task<IReadOnlyList<ReservaDto>> ListarAsync(CancellationToken ct);

        /// <summary>Devuelve null si la mesa ya está ocupada.</summary>
        Task<ReservaDto?> CrearAsync(ReservaGuardarDto dto, CancellationToken ct);
        Task<bool> EliminarAsync(int id, CancellationToken ct);
    }

    public class ReservaService : IReservaService
    {
        private readonly ApplicationDbContext _context;

        public ReservaService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<ReservaDto>> ListarAsync(CancellationToken ct) =>
            await _context.Reservas.AsNoTracking()
                .OrderBy(r => r.FechaHora)
                .Select(r => new ReservaDto(r.Id, r.Cliente, r.Personas, r.Telefono, r.FechaHora, r.IdMesa))
                .ToListAsync(ct);

        public async Task<ReservaDto?> CrearAsync(ReservaGuardarDto dto, CancellationToken ct)
        {
            // El plano trata una mesa como ocupada mientras tenga una reserva activa
            if (await _context.Reservas.AnyAsync(r => r.IdMesa == dto.IdMesa, ct))
                return null;

            var reserva = new Reserva
            {
                Cliente = dto.Cliente.Trim(),
                Personas = dto.Personas,
                Telefono = string.IsNullOrWhiteSpace(dto.Telefono) ? null : dto.Telefono.Trim(),
                FechaHora = dto.FechaHora,
                IdMesa = dto.IdMesa
            };

            _context.Reservas.Add(reserva);
            await _context.SaveChangesAsync(ct);
            return new ReservaDto(reserva.Id, reserva.Cliente, reserva.Personas, reserva.Telefono, reserva.FechaHora, reserva.IdMesa);
        }

        public async Task<bool> EliminarAsync(int id, CancellationToken ct) =>
            await _context.Reservas.Where(r => r.Id == id).ExecuteDeleteAsync(ct) > 0;
    }
}
