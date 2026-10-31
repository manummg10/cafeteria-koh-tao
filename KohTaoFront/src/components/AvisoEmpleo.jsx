import { Briefcase } from 'lucide-react';
import { EMPLEO, RUTA_EMPLEO } from '../config/empleo';

// Franja superior de la portada mientras la oferta de empleo esté activa
function AvisoEmpleo() {
  if (!EMPLEO.activa) return null;

  return (
    <a href={RUTA_EMPLEO} className="block bg-[#2c2520] text-[#f3e3c8] font-sans text-[11px] sm:text-xs font-semibold tracking-[0.15em] uppercase hover:bg-[#453931] transition-colors">
      <span className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-center">
        <Briefcase size={14} className="shrink-0" />
        <span>Buscamos {EMPLEO.puesto.toLowerCase()} · <span className="underline underline-offset-4">Envía tu CV</span></span>
      </span>
    </a>
  );
}

export default AvisoEmpleo;
