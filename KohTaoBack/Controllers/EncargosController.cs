using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KohTaoBack.DTOs;
using KohTaoBack.Models;
using KohTaoBack.Services;

namespace KohTaoBack.Controllers
{
    // Encargos con datos personales del cliente: solo personal del panel (Propietario / Desarrollador)
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = Politicas.GestionCafeteria)]
    public class EncargosController : ControllerBase
    {
        private readonly IEncargoService _service;

        public EncargosController(IEncargoService service)
        {
            _service = service;
        }

        // GET: api/encargos?incluirAntiguos=true
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<EncargoDto>>> GetEncargos([FromQuery] bool incluirAntiguos, CancellationToken ct) =>
            Ok(await _service.ListarAsync(incluirAntiguos, ct));

        // POST: api/encargos
        [HttpPost]
        public async Task<ActionResult<EncargoDto>> PostEncargo(EncargoGuardarDto dto, CancellationToken ct)
        {
            var r = await _service.CrearAsync(dto, ct);
            return r.Resultado == ResultadoEncargo.Ok
                ? CreatedAtAction(nameof(GetEncargos), new { id = r.Encargo!.Id }, r.Encargo)
                : BadRequest(new { mensaje = r.Error });
        }

        // PUT: api/encargos/5
        [HttpPut("{id:int}")]
        public async Task<ActionResult<EncargoDto>> PutEncargo(int id, EncargoGuardarDto dto, CancellationToken ct)
        {
            var r = await _service.ActualizarAsync(id, dto, ct);
            return r.Resultado switch
            {
                ResultadoEncargo.Ok => Ok(r.Encargo),
                ResultadoEncargo.Invalido => BadRequest(new { mensaje = r.Error }),
                _ => NotFound(new { mensaje = "El encargo no existe." })
            };
        }

        // PUT: api/encargos/5/estado
        [HttpPut("{id:int}/estado")]
        public async Task<IActionResult> PutEstado(int id, CambiarEstadoEncargoDto dto, CancellationToken ct) =>
            await _service.CambiarEstadoAsync(id, dto.Estado, ct) ? NoContent() : NotFound(new { mensaje = "El encargo no existe." });

        // DELETE: api/encargos/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteEncargo(int id, CancellationToken ct) =>
            await _service.EliminarAsync(id, ct) ? NoContent() : NotFound(new { mensaje = "El encargo no existe." });
    }
}
