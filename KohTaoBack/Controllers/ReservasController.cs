using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KohTaoBack.DTOs;
using KohTaoBack.Models;
using KohTaoBack.Services;

namespace KohTaoBack.Controllers
{
    // Reservas contienen datos personales (nombre, teléfono): solo el administrador.
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = Politicas.GestionCafeteria)]
    public class ReservasController : ControllerBase
    {
        private readonly IReservaService _service;

        public ReservasController(IReservaService service)
        {
            _service = service;
        }

        // GET: api/reservas
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ReservaDto>>> GetReservas(CancellationToken ct) =>
            Ok(await _service.ListarAsync(ct));

        // POST: api/reservas
        [HttpPost]
        public async Task<ActionResult<ReservaDto>> PostReserva(ReservaGuardarDto dto, CancellationToken ct)
        {
            var creada = await _service.CrearAsync(dto, ct);
            if (creada is null)
                return Conflict(new { mensaje = $"La mesa {dto.IdMesa} ya está ocupada." });

            return CreatedAtAction(nameof(GetReservas), new { id = creada.Id }, creada);
        }

        // DELETE: api/reservas/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteReserva(int id, CancellationToken ct) =>
            await _service.EliminarAsync(id, ct)
                ? Ok(new { mensaje = "Mesa liberada correctamente." })
                : NotFound(new { mensaje = "La reserva no existe en el sistema." });
    }
}
