using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using KohTaoBack.Models;
using KohTaoBack.Options;

namespace KohTaoBack.Services
{
    public interface ITokenService
    {
        (string Token, DateTimeOffset Expira) Crear(Usuario usuario);
    }

    public class TokenService : ITokenService
    {
        private readonly JwtOptions _opt;

        public TokenService(IOptions<JwtOptions> opt)
        {
            _opt = opt.Value;
        }

        public (string Token, DateTimeOffset Expira) Crear(Usuario usuario)
        {
            var expira = DateTimeOffset.UtcNow.AddMinutes(_opt.ExpiraMinutos);

            var descriptor = new SecurityTokenDescriptor
            {
                Issuer = _opt.Issuer,
                Audience = _opt.Audience,
                Expires = expira.UtcDateTime,
                Subject = new ClaimsIdentity(
                [
                    new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
                    new Claim("role", usuario.Rol),
                    new Claim(ClaimsSesion.Version, usuario.VersionSesion.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                ]),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_opt.Key)), SecurityAlgorithms.HmacSha256)
            };

            return (new JsonWebTokenHandler().CreateToken(descriptor), expira);
        }
    }
}
