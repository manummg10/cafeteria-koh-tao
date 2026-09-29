using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;
using KohTaoBack.DTOs;
using KohTaoBack.Options;
using KohTaoBack.Services;

namespace KohTaoBack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        public const string PoliticaLogin = "login";

        private readonly IAuthService _auth;
        private readonly ITokenService _tokens;
        private readonly JwtOptions _jwt;

        public AuthController(IAuthService auth, ITokenService tokens, IOptions<JwtOptions> jwt)
        {
            _auth = auth;
            _tokens = tokens;
            _jwt = jwt.Value;
        }

        // POST: api/auth/login
        [HttpPost("login")]
        [AllowAnonymous]
        [EnableRateLimiting(PoliticaLogin)]
        public async Task<ActionResult<UsuarioSesionDto>> Login(LoginRequest request, CancellationToken ct)
        {
            var ctx = new ContextoLogin(HttpContext.Connection.RemoteIpAddress?.ToString(), Request.Headers.UserAgent.ToString());
            var (resultado, usuario) = await _auth.LoginAsync(request.Email, request.Password, ctx, ct);

            if (resultado == ResultadoLogin.Bloqueado)
                return StatusCode(StatusCodes.Status423Locked, new { mensaje = "Cuenta bloqueada temporalmente. Inténtalo más tarde." });

            if (resultado != ResultadoLogin.Ok || usuario is null)
                return Unauthorized(new { mensaje = "Correo o contraseña incorrectos." });

            var (token, expira) = _tokens.Crear(usuario);
            Response.Cookies.Append(_jwt.CookieName, token, OpcionesCookie(expira));

            return Ok(new UsuarioSesionDto(usuario.Email, usuario.Rol));
        }

        // POST: api/auth/logout
        [HttpPost("logout")]
        [AllowAnonymous]
        public IActionResult Logout()
        {
            Response.Cookies.Delete(_jwt.CookieName, OpcionesCookie(null));
            return NoContent();
        }

        // GET: api/auth/me (el frontend lo usa para saber si hay sesión, sin tocar el token)
        [HttpGet("me")]
        [Authorize]
        public ActionResult<UsuarioSesionDto> Me() =>
            Ok(new UsuarioSesionDto(User.FindFirstValue("email") ?? string.Empty, User.FindFirstValue("role") ?? string.Empty));

        private static CookieOptions OpcionesCookie(DateTimeOffset? expira) => new()
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Path = "/",
            Expires = expira,
            IsEssential = true
        };
    }
}
