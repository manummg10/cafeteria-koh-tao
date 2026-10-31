import { Smile, Clock, Users, ShieldCheck, Coffee, UserStar, Mail, ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import { NEGOCIO, MODO_PREAPERTURA } from '../config/negocio';
import { EMPLEO, mailtoEmpleo } from '../config/empleo';

const ICONOS_VALORAMOS = { presencia: Smile, agilidad: Clock, equipo: Users, compromiso: ShieldCheck, experiencia: Coffee };

// El CV se envía desde la app de correo del propio dispositivo (mailto con asunto y texto ya escritos)
function BotonCorreo({ className = '' }) {
  return (
    <a href={mailtoEmpleo} className={`inline-flex items-center justify-center gap-2.5 py-4 px-8 text-xs sm:text-sm font-semibold rounded uppercase tracking-widest font-sans transition-all duration-300 hover:-translate-y-0.5 shadow-md ${className}`}>
      <Mail size={18} /> Envíanos tu CV
    </a>
  );
}

// En obras (MODO_PREAPERTURA) es la portada: vídeo de cabecera en lugar de la barra con enlace a la web
function TrabajaConNosotros() {
  // El vídeo ya trae el h1 de la cafetería
  const Titulo = MODO_PREAPERTURA ? 'h2' : 'h1';

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7]">
      {MODO_PREAPERTURA ? <HeroSection textoBoton="Trabaja con nosotros" /> : (
      <header className="bg-white border-b border-[#e6dfd5] sticky top-0 z-50 shadow-sm font-sans">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" aria-label="Ir a la web de Koh Tao Café" className="flex items-center">
            <img src="/favicon-192.png" alt="Logo Koh Tao" className="h-14 w-auto object-contain" />
          </a>
          <a href="/" className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-[#4a3319] uppercase hover:text-[#d4b285] transition-colors">
            <ArrowLeft size={14} /> Ver la cafetería
          </a>
        </div>
      </header>
      )}

      <main className="flex-grow">
        {/* Cabecera de la oferta */}
        <section className="px-5 pt-16 pb-12 text-center">
          <div className="max-w-[760px] mx-auto flex flex-col items-center">
            {EMPLEO.aperturaProxima && (
              <span className="inline-block bg-[#4a3319] text-[#f3e3c8] text-[11px] font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-6">
                Próximamente · Nueva apertura en {NEGOCIO.direccion.localidad}
              </span>
            )}
            <Titulo className="text-4xl md:text-6xl font-serif text-[#2c2520] leading-tight">
              ¿Quieres trabajar<br />con nosotros?
            </Titulo>
            <div className="flex items-center gap-4 mt-8 w-full max-w-md">
              <span className="flex-1 h-px bg-[#8c7662]/40" />
              <span className="font-sans text-sm tracking-[0.2em] uppercase text-[#51443a]">{NEGOCIO.nombre}</span>
              <span className="flex-1 h-px bg-[#8c7662]/40" />
            </div>
            <p className="font-sans font-semibold text-xl md:text-2xl tracking-[0.12em] uppercase text-[#2c2520] mt-3">
              {EMPLEO.activa ? `Busca ${EMPLEO.puesto}` : 'Ahora mismo no hay ofertas abiertas'}
            </p>
            <p className="text-base md:text-lg text-[#6e6359] font-serif italic leading-relaxed mt-6 max-w-xl">
              {EMPLEO.activa
                ? EMPLEO.intro
                : 'Puedes enviarnos tu CV igualmente y te tendremos en cuenta para futuras incorporaciones.'}
            </p>
            <BotonCorreo className="mt-8 bg-[#2c2520] text-white hover:bg-[#453931]" />
          </div>
        </section>

        {/* Requisitos */}
        <section className="px-5 pb-16">
          <div className="max-w-[1000px] mx-auto flex flex-col gap-12">
            <div className="bg-[#8c7662] text-white rounded-2xl px-6 py-6 flex items-center gap-5 max-w-2xl mx-auto w-full">
              <UserStar size={40} strokeWidth={1.4} className="shrink-0" />
              <div className="border-l border-white/40 pl-5">
                <p className="font-sans font-semibold tracking-[0.15em] uppercase text-lg">Imprescindible</p>
                <p className="font-sans text-sm md:text-base text-white/90">{EMPLEO.imprescindible}</p>
              </div>
            </div>

            <div>
              <h2 className="text-center font-sans text-xs font-semibold tracking-[0.3em] uppercase text-[#51443a] mb-8">También valoramos</h2>
              <ul className="grid grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-4">
                {EMPLEO.valoramos.map(({ id, texto }) => {
                  const Icono = ICONOS_VALORAMOS[id] ?? Coffee;
                  return (
                    <li key={id} className="flex flex-col items-center text-center gap-3 last:col-span-2 md:last:col-span-1">
                      <Icono size={30} strokeWidth={1.4} className="text-[#2c2520]" />
                      <span className="text-sm text-[#51443a] font-sans leading-snug max-w-[150px]">{texto}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="text-center text-xl md:text-2xl font-serif italic text-[#2c2520] leading-relaxed max-w-2xl mx-auto">
              “{EMPLEO.cierre}”
            </p>
          </div>
        </section>

        {/* Llamada final: abrir el correo del dispositivo */}
        <section className="px-5 pb-20">
          <div className="max-w-2xl mx-auto bg-[#2c2520] text-white rounded-2xl px-6 py-10 flex flex-col items-center text-center gap-4">
            <span className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-[#d4b285]">Te esperamos</span>
            <p className="text-sm md:text-base text-white/80 font-serif italic leading-relaxed max-w-md">
              Pulsa el botón y se abrirá tu correo con todo preparado: solo tienes que adjuntar tu CV y enviarlo.
            </p>
            <BotonCorreo className="bg-[#d4b285] text-[#2c2520] hover:bg-[#f3e3c8]" />
            <p className="text-xs text-white/60 font-sans mt-1">
              O escríbenos a <a href={`mailto:${EMPLEO.email}`} className="font-semibold text-[#f3e3c8] hover:text-white break-all">{EMPLEO.email}</a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default TrabajaConNosotros;
