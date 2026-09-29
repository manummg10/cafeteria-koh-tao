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
    public class ProductosController : ControllerBase
    {
        private readonly IProductoService _service;

        public ProductosController(IProductoService service)
        {
            _service = service;
        }

        // GET: api/productos (público: carta de la web)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IReadOnlyList<ProductoDto>>> GetProductos(CancellationToken ct) =>
            Ok(await _service.ListarAsync(ct));

        // POST: api/productos
        [HttpPost]
        public async Task<ActionResult<ProductoDto>> PostProducto(ProductoGuardarDto dto, CancellationToken ct)
        {
            var creado = await _service.CrearAsync(dto, ct);
            return CreatedAtAction(nameof(GetProductos), new { id = creado.Id }, creado);
        }

        // PUT: api/productos/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutProducto(int id, ProductoGuardarDto dto, CancellationToken ct) =>
            await _service.ActualizarAsync(id, dto, ct) ? NoContent() : NotFound();

        // DELETE: api/productos/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProducto(int id, CancellationToken ct) =>
            await _service.EliminarAsync(id, ct) ? NoContent() : NotFound();
    }
}
