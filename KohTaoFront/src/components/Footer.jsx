import { Coffee, MapPin, Phone, Clock } from 'lucide-react';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { NEGOCIO, direccionCompleta, mapaComoLlegarUrl, telefonoHref } from '../config/negocio';
import { DESARROLLADOR } from '../config/desarrollador';

// Siempre se muestran; sin URL real aún, el icono no es enlace y avisa "Próximamente"
const REDES = [
  { url: NEGOCIO.redes.instagram, titulo: 'Instagram', Icono: FaInstagram },
  { url: NEGOCIO.redes.facebook, titulo: 'Facebook', Icono: FaFacebookF },
];

const claseIconoRed = 'bg-white/10 p-2.5 rounded-full transition-all duration-300 flex items-center justify-center';

function CreditoDesarrollador() {
  const contenido = (
    <>
      <img src={DESARROLLADOR.logo} alt="" width="16" height="16" className="w-4 h-4 rounded-full" loading="lazy" />
      <span>Web desarrollada por {DESARROLLADOR.nombre}</span>
    </>
  );
  const clase = 'flex items-center gap-1.5 normal-case tracking-wide opacity-60 hover:opacity-100 transition-opacity';

  return DESARROLLADOR.url ? (
    <a href={DESARROLLADOR.url} target="_blank" rel="noopener" className={clase}>{contenido}</a>
  ) : (
    <span className={clase}>{contenido}</span>
  );
}

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

        {/* Columna 3: Redes Sociales */}
        <div className="flex flex-col gap-4 text-center md:text-left items-center md:items-start">
          <h4 className="font-sans font-semibold text-white uppercase tracking-widest text-xs mb-2 border-b border-[#d4b285]/20 pb-1.5 w-fit">
            Síguenos
          </h4>
          <p className="text-sm font-serif italic text-[#e6dfd5]/80 leading-relaxed">
            No te pierdas nuestras novedades diarias y tartas especiales.
          </p>
          <div className="flex gap-4">
            {REDES.map(({ url, titulo, Icono }) => (url ? (
              <a key={titulo} href={url} target="_blank" rel="noopener noreferrer" title={titulo} aria-label={titulo}
                className={`${claseIconoRed} hover:bg-[#d4b285] hover:text-[#4a3319]`}>
                <Icono size={18} />
              </a>
            ) : (
              <span key={titulo} title={`${titulo} (próximamente)`} aria-label={`${titulo}, próximamente`}
                className={`${claseIconoRed} opacity-60 cursor-default`}>
                <Icono size={18} />
              </span>
            )))}
          </div>
        </div>

      </div>

      {/* Barra inferior de Copyright */}
      <div className="bg-[#362410] border-t border-black/10 text-[10px] font-sans text-[#d4b285]/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="uppercase tracking-[0.15em] text-center">&copy; {anioActual} {NEGOCIO.nombre}. Todos los derechos reservados.</p>
          <CreditoDesarrollador />
        </div>
      </div>
    </footer>
  );
}

export default Footer;