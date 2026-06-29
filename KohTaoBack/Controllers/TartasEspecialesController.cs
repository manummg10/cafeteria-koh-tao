using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KohTaoBack.Data;
using KohTaoBack.Models;

namespace KohTaoBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TartasEspecialesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TartasEspecialesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/tartasespeciales
        [HttpGet]
        public async Task<IActionResult> GetTartasEspeciales()
        {
            try
            {
                // Al traer la lista directa, Entity Framework leerá "imagen_url" 
                // gracias a la etiqueta [Column] del modelo.
                var tartas = await _context.TartasEspeciales.ToListAsync();
                return Ok(tartas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al cargar las tartas: {ex.Message}");
            }
        }

        // POST: api/tartasespeciales
        [HttpPost]
        public async Task<IActionResult> PostTartaEspecial([FromBody] TartaEspecial tarta)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.TartasEspeciales.Add(tarta);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetTartasEspeciales), new { id = tarta.Id }, tarta);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al guardar la tarta: {ex.Message}");
            }
        }
    }
}