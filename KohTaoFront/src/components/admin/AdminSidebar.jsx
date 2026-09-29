import PropTypes from 'prop-types';
import { LayoutGrid, Image, Calendar, LogOut } from 'lucide-react';
import logoKohTao from '../../assets/logo.png';

const SECCIONES = [
  { id: 'carta', etiqueta: 'Gestionar Carta', Icono: LayoutGrid },
  { id: 'especiales', etiqueta: 'Especiales del Día', Icono: Image },
  { id: 'reservas', etiqueta: 'Reservas', Icono: Calendar },
];

function AdminSidebar({ seccionActiva, onCambiar, totalReservas, email, onLogout }) {
  return (
    <aside className="w-full md:w-72 md:shrink-0 bg-[#4a3319] text-white flex flex-col p-4 md:p-6 shadow-md md:sticky md:top-0 md:h-screen z-10">
      <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 mb-4 md:mb-8 border-b border-white/10 pb-4 md:pb-6">
        <div className="bg-white rounded-full w-14 h-14 md:w-36 md:h-36 flex items-center justify-center overflow-hidden p-1.5 md:p-3 shadow-inner">
          <img src={logoKohTao} alt="Logo Koh Tao" className="w-full h-full object-contain" />
        </div>
        <span className="text-base md:text-xl font-bold text-[#d4b285] tracking-widest font-serif">KOH TAO PANEL</span>
      </div>

      <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 font-sans scrollbar-none">
        {SECCIONES.map(({ id, etiqueta, Icono }) => (
          <button
            key={id}
            type="button"
            onClick={() => onCambiar(id)}
            className={`flex items-center gap-3 p-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap text-left shrink-0 md:shrink ${seccionActiva === id ? 'bg-[#d4b285] text-[#4a3319] shadow-md' : 'text-white hover:bg-white/10'}`}
          >
            <Icono size={16} /> {etiqueta}{id === 'reservas' && ` (${totalReservas})`}
          </button>
        ))}
      </nav>

      <div className="mt-4 md:mt-auto pt-4 border-t border-white/10 flex md:flex-col items-center md:items-stretch justify-between gap-2">
        <span className="text-[11px] text-white/70 truncate" title={email}>{email}</span>
        <button type="button" onClick={onLogout} className="flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-red-700 transition-colors">
          <LogOut size={14} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

AdminSidebar.propTypes = {
  seccionActiva: PropTypes.string.isRequired,
  onCambiar: PropTypes.func.isRequired,
  totalReservas: PropTypes.number.isRequired,
  email: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
};

export default AdminSidebar;
