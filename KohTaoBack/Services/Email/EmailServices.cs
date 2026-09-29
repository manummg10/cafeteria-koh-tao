using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Channels;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using KohTaoBack.Options;

namespace KohTaoBack.Services.Email
{
    public record EmailMensaje(string Para, string Asunto, string CuerpoTexto);

    // Cola en memoria: el login responde al instante y el correo se envía en segundo plano.
    public interface IEmailQueue
    {
        void Encolar(EmailMensaje mensaje);
    }

    public class EmailQueue : IEmailQueue
    {
        private readonly Channel<EmailMensaje> _canal =
            Channel.CreateBounded<EmailMensaje>(new BoundedChannelOptions(100) { FullMode = BoundedChannelFullMode.DropOldest });

        public ChannelReader<EmailMensaje> Lector => _canal.Reader;

        public void Encolar(EmailMensaje mensaje) => _canal.Writer.TryWrite(mensaje);
    }

    public interface IEmailSender
    {
        string Canal { get; }
        Task EnviarAsync(EmailMensaje mensaje, CancellationToken ct);
    }

    // API HTTP de Resend (puerto 443). Necesaria en Render gratuito, que bloquea los puertos SMTP 25/465/587.
    public class ResendApiEmailSender : IEmailSender
    {
        public const string HttpClientName = "resend";

        private readonly IHttpClientFactory _http;
        private readonly SmtpOptions _opt;

        public ResendApiEmailSender(IHttpClientFactory http, IOptions<SmtpOptions> opt)
        {
            _http = http;
            _opt = opt.Value;
        }

        public string Canal => "Resend API";

        public async Task EnviarAsync(EmailMensaje mensaje, CancellationToken ct)
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, "emails")
            {
                Content = JsonContent.Create(new
                {
                    from = $"{_opt.RemitenteNombre} <{_opt.Remitente}>",
                    to = new[] { mensaje.Para },
                    subject = mensaje.Asunto,
                    text = mensaje.CuerpoTexto
                })
            };
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _opt.ApiKeyResendEfectiva);

            using var response = await _http.CreateClient(HttpClientName).SendAsync(request, ct);
            if (!response.IsSuccessStatusCode)
            {
                // El cuerpo de error de Resend explica el motivo (p. ej. restricciones del modo de pruebas); no contiene la clave
                var detalle = await response.Content.ReadAsStringAsync(ct);
                throw new HttpRequestException($"Resend {(int)response.StatusCode}: {(detalle.Length > 300 ? detalle[..300] : detalle)}");
            }
        }
    }

    public class SmtpEmailSender : IEmailSender
    {
        private readonly SmtpOptions _opt;

        public SmtpEmailSender(IOptions<SmtpOptions> opt)
        {
            _opt = opt.Value;
        }

        public string Canal => "SMTP";

        public async Task EnviarAsync(EmailMensaje mensaje, CancellationToken ct)
        {
            var mime = new MimeMessage();
            mime.From.Add(new MailboxAddress(_opt.RemitenteNombre, _opt.Remitente));
            mime.To.Add(MailboxAddress.Parse(mensaje.Para));
            mime.Subject = mensaje.Asunto;
            mime.Body = new TextPart("plain") { Text = mensaje.CuerpoTexto };

            using var cliente = new SmtpClient();
            var tls = _opt.Port == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls;
            await cliente.ConnectAsync(_opt.Host, _opt.Port, tls, ct);
            if (!string.IsNullOrEmpty(_opt.Usuario))
                await cliente.AuthenticateAsync(_opt.Usuario, _opt.Password, ct);
            await cliente.SendAsync(mime, ct);
            await cliente.DisconnectAsync(true, ct);
        }
    }

    public class EmailBackgroundService : BackgroundService
    {
        private readonly EmailQueue _cola;
        private readonly SmtpOptions _opt;
        private readonly IServiceProvider _services;
        private readonly ILogger<EmailBackgroundService> _logger;

        public EmailBackgroundService(EmailQueue cola, IOptions<SmtpOptions> opt, IServiceProvider services, ILogger<EmailBackgroundService> logger)
        {
            _cola = cola;
            _opt = opt.Value;
            _services = services;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Con API key de Resend se usa HTTPS; si no, SMTP clásico
            IEmailSender sender = _opt.ApiKeyResendEfectiva is not null
                ? _services.GetRequiredService<ResendApiEmailSender>()
                : _services.GetRequiredService<SmtpEmailSender>();

            await foreach (var mensaje in _cola.Lector.ReadAllAsync(stoppingToken))
            {
                if (!_opt.Configurado)
                {
                    _logger.LogWarning("Correo no configurado: se descarta '{Asunto}'.", mensaje.Asunto);
                    continue;
                }

                try
                {
                    await sender.EnviarAsync(mensaje, stoppingToken);
                    _logger.LogInformation("Correo '{Asunto}' enviado vía {Canal}", mensaje.Asunto, sender.Canal);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    // No se registra el contenido del correo ni credenciales
                    _logger.LogError("Error enviando correo '{Asunto}' vía {Canal}: {Tipo} {Detalle}",
                        mensaje.Asunto, sender.Canal, ex.GetType().Name, ex is HttpRequestException ? ex.Message : string.Empty);
                }
            }
        }
    }
}
