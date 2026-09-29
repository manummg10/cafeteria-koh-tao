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

    public class EmailBackgroundService : BackgroundService
    {
        private readonly EmailQueue _cola;
        private readonly SmtpOptions _smtp;
        private readonly ILogger<EmailBackgroundService> _logger;

        public EmailBackgroundService(EmailQueue cola, IOptions<SmtpOptions> smtp, ILogger<EmailBackgroundService> logger)
        {
            _cola = cola;
            _smtp = smtp.Value;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await foreach (var mensaje in _cola.Lector.ReadAllAsync(stoppingToken))
            {
                if (!_smtp.Configurado)
                {
                    _logger.LogWarning("SMTP no configurado: se descarta el correo '{Asunto}'.", mensaje.Asunto);
                    continue;
                }

                try
                {
                    await EnviarAsync(mensaje, stoppingToken);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    // No se registra el contenido del correo ni credenciales SMTP
                    _logger.LogError("Error enviando correo '{Asunto}': {Tipo}", mensaje.Asunto, ex.GetType().Name);
                }
            }
        }

        private async Task EnviarAsync(EmailMensaje mensaje, CancellationToken ct)
        {
            var mime = new MimeMessage();
            mime.From.Add(new MailboxAddress(_smtp.RemitenteNombre, _smtp.Remitente));
            mime.To.Add(MailboxAddress.Parse(mensaje.Para));
            mime.Subject = mensaje.Asunto;
            mime.Body = new TextPart("plain") { Text = mensaje.CuerpoTexto };

            using var cliente = new SmtpClient();
            var tls = _smtp.Port == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls;
            await cliente.ConnectAsync(_smtp.Host, _smtp.Port, tls, ct);
            if (!string.IsNullOrEmpty(_smtp.Usuario))
                await cliente.AuthenticateAsync(_smtp.Usuario, _smtp.Password, ct);
            await cliente.SendAsync(mime, ct);
            await cliente.DisconnectAsync(true, ct);
        }
    }
}
