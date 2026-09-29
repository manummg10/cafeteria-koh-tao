import PropTypes from 'prop-types';
import { Edit2, Trash2, Phone, Mail, Clock } from 'lucide-react';
import { formatearFecha } from '../../../utils/fecha';
import { ESTADOS, claseEstado, euros } from './estados';

function EncargoCard({ encargo, onEditar, onBorrar, onCambiarEstado }) {
  const { cliente, telefono, email, fechaRecogida, estado, lineas, notas, total } = encargo;

  return (
    <article className="p-4 bg-white border border-[#e6dfd5] rounded-xl shadow-xs flex flex-col gap-3">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-[#4a3319] truncate">{cliente}</h3>
          <p className="flex items-center gap-1 text-xs text-gray-500"><Clock size={12} /> Recogida: {formatearFecha(fechaRecogida)}</p>
        </div>
        <select
          aria-label={`Estado del encargo de ${cliente}`}
          value={estado}
          onChange={e => onCambiarEstado(e.target.value)}
          className={`shrink-0 text-xs font-bold rounded-full border px-2 py-1 ${claseEstado(estado)}`}
        >
          {ESTADOS.map(({ id }) => <option key={id} value={id}>{id}</option>)}
        </select>
      </header>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <a href={`tel:${telefono.replace(/\s/g, '')}`} className="flex items-center gap-1 text-[#614424] hover:underline"><Phone size={12} /> {telefono}</a>
        {email && <a href={`mailto:${email}`} className="flex items-center gap-1 text-[#614424] hover:underline truncate"><Mail size={12} /> {email}</a>}
      </div>

      {lineas.length > 0 && (
        <ul className="text-sm divide-y divide-gray-100">
          {lineas.map(l => (
            <li key={`${l.tipo}-${l.productoId}`} className="flex justify-between py-1">
              <span>{l.cantidad}× {l.nombre}</span>
              <span className="text-gray-500">{euros(l.precioUnitario * l.cantidad)}</span>
            </li>
          ))}
        </ul>
      )}

      {notas && <p className="text-sm italic text-gray-600 bg-[#fdfbf7] p-2 rounded-lg whitespace-pre-line">📝 {notas}</p>}

      <footer className="flex items-center justify-between pt-2 border-t border-gray-100">
        <strong className="text-[#4a3319]">{lineas.length > 0 ? `Total: ${euros(total)}` : 'Precio a convenir'}</strong>
        <div className="flex gap-2">
          <button type="button" onClick={onEditar} aria-label={`Editar encargo de ${cliente}`} className="bg-[#614424] text-white p-2 rounded-md"><Edit2 size={14} /></button>
          <button type="button" onClick={onBorrar} aria-label={`Eliminar encargo de ${cliente}`} className="bg-red-600 text-white p-2 rounded-md"><Trash2 size={14} /></button>
        </div>
      </footer>
    </article>
  );
}

EncargoCard.propTypes = {
  encargo: PropTypes.shape({
    cliente: PropTypes.string.isRequired,
    telefono: PropTypes.string.isRequired,
    email: PropTypes.string,
    fechaRecogida: PropTypes.string.isRequired,
    estado: PropTypes.string.isRequired,
    lineas: PropTypes.array.isRequired,
    notas: PropTypes.string,
    total: PropTypes.number.isRequired,
  }).isRequired,
  onEditar: PropTypes.func.isRequired,
  onBorrar: PropTypes.func.isRequired,
  onCambiarEstado: PropTypes.func.isRequired,
};

export default EncargoCard;
