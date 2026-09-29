using Microsoft.Extensions.Options;
using KohTaoBack.Models;
using KohTaoBack.Options;

namespace KohTaoBack.Services.Email
{
    public record ContextoLogin(string? Ip, string? Navegador);

    // Emails de seguridad enviados al propio usuario afectado (nunca incluyen contraseñas)
    public interface IAvisosSeguridad
    {
        void AccesoCorrecto(Usuario u, ContextoLogin ctx);
        void CuentaBloqueada(Usuario u, ContextoLogin ctx);
        void PasswordCambiada(Usuario u, ContextoLogin ctx);
        void PasswordRestablecida(Usuario u);
    }

    public class AvisosSeguridad : IAvisosSeguridad
    {
        private readonly IEmailQueue _emails;
        private readonly SeguridadLoginOptions _opt;

        public AvisosSeguridad(IEmailQueue emails, IOptions<SeguridadLoginOptions> opt)
        {
            _emails = emails;
            _opt = opt.Value;
        }

        public void AccesoCorrecto(Usuario u, ContextoLogin ctx) => Enviar(u,
            "Nuevo acceso al panel de administración",
            $"""
            Se ha iniciado sesión en el panel de administración de Koh Tao.

              Fecha y hora: {Ahora()}
              Dirección IP: {ctx.Ip ?? "desconocida"}
              Navegador:    {Recortar(ctx.Navegador)}

            Si has sido tú, no tienes que hacer nada.
            Si NO reconoces este acceso, cambia tu contraseña inmediatamente.
            """);

        public void CuentaBloqueada(Usuario u, ContextoLogin ctx) => Enviar(u,
            "Cuenta bloqueada temporalmente",
            $"""
            Se han detectado {_opt.MaxIntentosFallidos} intentos fallidos de acceso al panel de Koh Tao.
            La cuenta queda bloqueada durante {_opt.MinutosBloqueo} minutos.

              Fecha y hora: {Ahora()}
              Dirección IP: {ctx.Ip ?? "desconocida"}

            Si no has sido tú, alguien podría estar intentando acceder a tu cuenta.
            """);

        public void PasswordCambiada(Usuario u, ContextoLogin ctx) => Enviar(u,
            "Tu contraseña ha cambiado",
            $"""
            La contraseña de tu cuenta del panel de Koh Tao se ha cambiado. Las demás sesiones abiertas se han cerrado.

              Fecha y hora: {Ahora()}
              Dirección IP: {ctx.Ip ?? "desconocida"}

            Si NO has sido tú, contacta inmediatamente con el desarrollador de la web.
            """);

        public void PasswordRestablecida(Usuario u) => Enviar(u,
            "Tu contraseña ha sido restablecida",
            $"""
            El desarrollador de la web ha restablecido la contraseña de tu cuenta del panel de Koh Tao ({Ahora()}).
            Te facilitará una contraseña temporal por un canal privado; al entrar tendrás que elegir una nueva.
            """);

        private void Enviar(Usuario u, string asunto, string cuerpo) =>
            _emails.Encolar(new EmailMensaje(u.Email, $"Koh Tao · {asunto}", $"Hola,\n\n{cuerpo}"));

        private string Ahora()
        {
            var utc = DateTime.UtcNow;
            try
            {
                var zona = TimeZoneInfo.FindSystemTimeZoneById(_opt.ZonaHoraria);
                return TimeZoneInfo.ConvertTimeFromUtc(utc, zona).ToString("dd/MM/yyyy HH:mm:ss") + $" ({_opt.ZonaHoraria})";
            }
            catch (TimeZoneNotFoundException)
            {
                return utc.ToString("dd/MM/yyyy HH:mm:ss") + " (UTC)";
            }
        }

        private static string Recortar(string? texto) =>
            string.IsNullOrWhiteSpace(texto) ? "desconocido" : texto.Length > 200 ? texto[..200] : texto;
    }
}
