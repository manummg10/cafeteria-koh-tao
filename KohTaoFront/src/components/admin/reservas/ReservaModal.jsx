import { useState } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { formatearFecha, ahoraLocalISO } from './mesas';

const inputModal = 'w-full p-2 rounded-lg border border-[#dcd3c6] text-sm';
const labelModal = 'block mb-1 text-xs font-bold uppercase tracking-wider text-[#4a3319]';

function ReservaModal({ mesa, reserva, onCerrar, onCrear, onLiberar }) {
  const [form, setForm] = useState({
    idMesa: mesa.numero.toString(),
    cliente: '',
    personas: '2',
    telefono: '',
    fechaHora: ahoraLocalISO(),
  });
  const cambiar = campo => e => setForm(f => ({ ...f, [campo]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    onCrear({
      cliente: form.cliente,
      personas: Number.parseInt(form.personas, 10),
      telefono: form.telefono || null,
      fechaHora: `${form.fechaHora}:00`,
      idMesa: Number.parseInt(form.idMesa, 10),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-[fadeIn_0.15s_ease-out]">
      <div role="dialog" aria-modal="true" className="bg-white rounded-xl border border-[#e6dfd5] shadow-xl w-full max-w-md overflow-hidden animate-[scaleUp_0.2s_ease-out] max-h-[90vh] flex flex-col">
        <div className={`p-4 text-white font-serif font-bold text-base flex items-center justify-between ${reserva ? 'bg-red-700' : 'bg-[#4a3319]'}`}>
          <span>Mesa {mesa.numero} — {mesa.zona}</span>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="text-white/80 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 font-sans text-sm">
          {reserva ? (
            <div>
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-800 mb-2.5">Detalles de la ocupación:</h4>
                <div className="flex flex-col gap-2 text-gray-700">
                  <p><strong>Cliente:</strong> {reserva.cliente}</p>
                  <p><strong>Comensales:</strong> {reserva.personas} personas</p>
                  {reserva.telefono && <p><strong>Teléfono:</strong> {reserva.telefono}</p>}
                  <p><strong>Fecha/Hora:</strong> {formatearFecha(reserva.fechaHora)}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button type="button" onClick={() => onLiberar(reserva.id)} className="w-full p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
                  ✓ Atendida (Marcar como Vacía)
                </button>
                <button type="button" onClick={onCerrar} className="w-full p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
                  Volver al Plano
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="reserva-mesa" className={labelModal}>Número de Mesa *</label>
                <input id="reserva-mesa" type="number" min="1" required value={form.idMesa} onChange={cambiar('idMesa')} className={`${inputModal} bg-gray-50`} />
              </div>
              <div>
                <label htmlFor="reserva-cliente" className={labelModal}>Nombre del Cliente *</label>
                <input id="reserva-cliente" type="text" required maxLength={100} value={form.cliente} onChange={cambiar('cliente')} placeholder="Ej. Juan Pérez" className={inputModal} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reserva-personas" className={labelModal}>Personas</label>
                  <select id="reserva-personas" value={form.personas} onChange={cambiar('personas')} className={`${inputModal} bg-white`}>
                    {Array.from({ length: 100 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'persona' : 'personas'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="reserva-telefono" className={labelModal}>Teléfono</label>
                  <input id="reserva-telefono" type="tel" maxLength={20} value={form.telefono} onChange={cambiar('telefono')} placeholder="Opcional" className={inputModal} />
                </div>
              </div>
              <div>
                <label htmlFor="reserva-fecha" className={labelModal}>Fecha y Hora de la Reserva *</label>
                <input id="reserva-fecha" type="datetime-local" required value={form.fechaHora} onChange={cambiar('fechaHora')} className={`${inputModal} text-[#4a3319]`} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-grow p-3 bg-green-700 hover:bg-green-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
                  Ocupar / Confirmar
                </button>
                <button type="button" onClick={onCerrar} className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

ReservaModal.propTypes = {
  mesa: PropTypes.shape({ numero: PropTypes.number.isRequired, zona: PropTypes.string.isRequired }).isRequired,
  reserva: PropTypes.shape({
    id: PropTypes.number, cliente: PropTypes.string, personas: PropTypes.number,
    telefono: PropTypes.string, fechaHora: PropTypes.string,
  }),
  onCerrar: PropTypes.func.isRequired,
  onCrear: PropTypes.func.isRequired,
  onLiberar: PropTypes.func.isRequired,
};

export default ReservaModal;
