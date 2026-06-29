using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KohTaoBack.Data;
using KohTaoBack.Models;

namespace KohTaoBack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReservasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/reservas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reserva>>> GetReservas()
        {
            return await _context.Reservas.ToListAsync();
        }

        // POST: api/reservas
        [HttpPost]
        public async Task<ActionResult<Reserva>> PostReserva(Reserva reserva)
        {
            _context.Reservas.Add(reserva);
            await _context.SaveChangesAsync();

            // Retornamos un código 201 Created con el ID de la reserva generada
            return CreatedAtAction(nameof(GetReservas), new { id = reserva.Id }, reserva);
        }

        // DELETE: api/reservas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReserva(int id)
        {
            var reserva = await _context.Reservas.FindAsync(id);
            if (reserva == null)
            {
                return NotFound(new { mensaje = "La reserva no existe en el sistema." });
            }

            _context.Reservas.Remove(reserva);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = $"Mesa {reserva.IdMesa} liberada correctamente." });
        }
    }
}