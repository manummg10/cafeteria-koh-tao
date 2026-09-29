import { Coffee, MapPin, Phone, Clock, Share2, Globe } from 'lucide-react';
import { NEGOCIO, direccionCompleta, mapaComoLlegarUrl, telefonoHref } from '../config/negocio';

const redes = [
  { url: NEGOCIO.redes.instagram, titulo: 'Instagram', Icono: Globe },
  { url: NEGOCIO.redes.facebook, titulo: 'Facebook', Icono: Share2 },
].filter(r => r.url);

function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="bg-[#4a3319] text-[#e6dfd5] border-t border-[#d4b285]/20 font-sans">
      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Columna 1: Identidad */}
        <div className="flex flex-col gap-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Coffee className="text-[#d4b285]" size={20} />
            <span className="font-sans font-semibold text-lg tracking-widest text-white uppercase">KOH TAO</span>
          </div>
          <p className="text-sm md:text-base text-[#e6dfd5]/80 font-serif italic max-w-sm mx-auto md:mx-0 leading-relaxed">
            Tu rincón especial para disfrutar de cafés de especialidad, dulces artesanales y un ambiente inigualable.
          </p>
        </div>

        {/* Columna 2: Horario y Contacto */}
        <div className="flex flex-col gap-3 text-center md:text-left items-center md:items-start">
          <h4 className="font-sans font-semibold text-white uppercase tracking-widest text-xs mb-2 border-b border-[#d4b285]/20 pb-1.5 w-fit">
            Contacto y Horario
          </h4>
          {NEGOCIO.horario.map(({ dias, horas }) => (
            <div key={dias} className="flex items-center gap-2 text-sm font-serif italic text-[#e6dfd5]/90">
              <Clock size={16} className="text-[#d4b285] shrink-0" />
              <span>{dias}: {horas}</span>
            </div>
          ))}
          <a href={mapaComoLlegarUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-serif italic text-[#e6dfd5]/90 hover:text-[#d4b285]">
            <MapPin size={16} className="text-[#d4b285] shrink-0" />
            <span>{direccionCompleta}</span>
          </a>
          {NEGOCIO.telefono && (
            <a href={telefonoHref} className="flex items-center gap-2 text-sm font-serif italic text-[#e6dfd5]/90 hover:text-[#d4b285]">
              <Phone size={16} className="text-[#d4b285] shrink-0" />
              <span>{NEGOCIO.telefono}</span>
            </a>
          )}
        </div>

        {/* Columna 3: Redes Sociales (solo las configuradas) o, si no hay, cómo llegar */}
        <div className="flex flex-col gap-4 text-center md:text-left items-center md:items-start">
          <h4 className="font-sans font-semibold text-white uppercase tracking-widest text-xs mb-2 border-b border-[#d4b285]/20 pb-1.5 w-fit">
            {redes.length > 0 ? 'Síguenos' : 'Visítanos'}
          </h4>
          <p className="text-sm font-serif italic text-[#e6dfd5]/80 leading-relaxed">
            {redes.length > 0 ? 'No te pierdas nuestras novedades diarias y tartas especiales.' : 'Te esperamos con el mejor café y tartas recién hechas.'}
          </p>
          {redes.length > 0 ? (
            <div className="flex gap-4">
              {redes.map(({ url, titulo, Icono }) => (
                <a
                  key={titulo}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-[#d4b285] hover:text-[#4a3319] p-2.5 rounded-full transition-all duration-300 flex items-center justify-center"
                  title={titulo}
                >
                  <Icono size={18} />
                </a>
              ))}
            </div>
          ) : (
            <a href={mapaComoLlegarUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold uppercase tracking-widest text-[#d4b285] hover:text-white">
              📍 Cómo llegar
            </a>
          )}
        </div>

      </div>

      {/* Barra inferior de Copyright */}
      <div className="bg-[#362410] py-4 text-center text-[10px] font-sans uppercase tracking-[0.15em] text-[#d4b285]/50 border-t border-black/10">
        <p>&copy; {anioActual} {NEGOCIO.nombre}. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;