using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KohTaoBack.DTOs;
using KohTaoBack.Models;
using KohTaoBack.Services;

namespace KohTaoBack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = Politicas.GestionCafeteria)]
    public class TartasEspecialesController : ControllerBase
    {
        private readonly ITartaEspecialService _service;

        public TartasEspecialesController(ITartaEspecialService service)
        {
            _service = service;
        }

        // GET: api/tartasespeciales (público: destacados de la web)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IReadOnlyList<TartaEspecialDto>>> GetTartasEspeciales(CancellationToken ct) =>
            Ok(await _service.ListarAsync(ct));

        // POST: api/tartasespeciales
        [HttpPost]
        public async Task<ActionResult<TartaEspecialDto>> PostTartaEspecial(TartaEspecialGuardarDto dto, CancellationToken ct)
        {
            var creada = await _service.CrearAsync(dto, ct);
            return CreatedAtAction(nameof(GetTartasEspeciales), new { id = creada.Id }, creada);
        }

        // PUT: api/tartasespeciales/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutTartaEspecial(int id, TartaEspecialGuardarDto dto, CancellationToken ct) =>
            await _service.ActualizarAsync(id, dto, ct) ? NoContent() : NotFound();

        // DELETE: api/tartasespeciales/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTartaEspecial(int id, CancellationToken ct) =>
            await _service.EliminarAsync(id, ct) ? NoContent() : NotFound();
    }
}
