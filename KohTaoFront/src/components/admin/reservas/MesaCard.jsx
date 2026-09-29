import PropTypes from 'prop-types';
import { formatearFecha } from './mesas';

function MesaCard({ mesa, reserva, onClick }) {
  const ocupada = !!reserva;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-3.5 rounded-xl border transition-all duration-300 text-left flex flex-col justify-between h-32 shadow-xs relative overflow-hidden group active:scale-95 ${ocupada
        ? 'bg-red-50/90 border-red-200 hover:border-red-400'
        : 'bg-green-50/90 border-green-200 hover:border-green-400'}`}
    >
      <div className={`absolute top-0 right-0 py-0.5 px-2 text-[9px] font-extrabold uppercase tracking-wider rounded-bl-lg text-white ${ocupada ? 'bg-red-600' : 'bg-green-600'}`}>
        {ocupada ? 'Ocupado' : 'Vacío'}
      </div>

      <h3 className="text-xl font-black text-[#4a3319] font-serif">Nº {mesa.numero}</h3>

      <div className="pt-2 border-t border-gray-100 w-full flex items-center justify-between">
        {ocupada ? (
          <div className="overflow-hidden w-full">
            <span className="text-[11px] font-bold text-red-800 block truncate">👤 {reserva.cliente}</span>
            <span className="text-[9px] text-gray-500 font-mono block">🕒 {formatearFecha(reserva.fechaHora)}</span>
          </div>
        ) : (
          <span className="text-[10px] font-bold text-green-700 tracking-wide uppercase group-hover:underline">+ Reservar</span>
        )}
      </div>
    </button>
  );
}

MesaCard.propTypes = {
  mesa: PropTypes.shape({ numero: PropTypes.number.isRequired }).isRequired,
  reserva: PropTypes.shape({ cliente: PropTypes.string, fechaHora: PropTypes.string }),
  onClick: PropTypes.func.isRequired,
};

export default MesaCard;
