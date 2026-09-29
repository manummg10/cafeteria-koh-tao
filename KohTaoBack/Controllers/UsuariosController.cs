using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KohTaoBack.DTOs;
using KohTaoBack.Models;
using KohTaoBack.Services;

namespace KohTaoBack.Controllers
{
    // Gestión de cuentas del panel: solo el Desarrollador
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = Politicas.GestionUsuarios)]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _service;

        public UsuariosController(IUsuarioService service)
        {
            _service = service;
        }

        // GET: api/usuarios
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<UsuarioDto>>> GetUsuarios(CancellationToken ct) =>
            Ok(await _service.ListarAsync(ct));

        // POST: api/usuarios
        [HttpPost]
        public async Task<ActionResult<UsuarioDto>> PostUsuario(CrearUsuarioRequest request, CancellationToken ct)
        {
            var (resultado, usuario) = await _service.CrearAsync(request, ct);
            return resultado == ResultadoUsuario.EmailDuplicado
                ? Conflict(new { mensaje = "Ya existe un usuario con ese correo." })
                : CreatedAtAction(nameof(GetUsuarios), new { id = usuario!.Id }, usuario);
        }

        // POST: api/usuarios/5/restablecer-password
        [HttpPost("{id:int}/restablecer-password")]
        public async Task<IActionResult> RestablecerPassword(int id, RestablecerPasswordRequest request, CancellationToken ct) =>
            await _service.RestablecerPasswordAsync(id, request.PasswordTemporal, ct) == ResultadoUsuario.Ok
                ? NoContent()
                : NotFound(new { mensaje = "El usuario no existe." });

        // DELETE: api/usuarios/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUsuario(int id, CancellationToken ct)
        {
            if (!int.TryParse(User.FindFirstValue("sub"), out var actorId)) return Unauthorized();

            return await _service.EliminarAsync(id, actorId, ct) switch
            {
                ResultadoUsuario.Ok => NoContent(),
                ResultadoUsuario.NoPermitido => BadRequest(new { mensaje = "No puedes eliminar tu propia cuenta ni el último desarrollador." }),
                _ => NotFound(new { mensaje = "El usuario no existe." })
            };
        }
    }
}
