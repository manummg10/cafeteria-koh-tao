import { useState } from 'react';
import PropTypes from 'prop-types';
import { useMensajeTemporal } from '../../../hooks/useMensajeTemporal';
import { MensajeEstado } from '../ui/AdminUI';
import { mensajeDeError } from '../ui/mensajeDeError';
import { MESAS, ZONAS } from './mesas';
import { exportarReservasPDF } from './exportarReservasPDF';
import MesaCard from './MesaCard';
import ReservaModal from './ReservaModal';

// Recibe el recurso desde el Dashboard (comparte el contador de reservas con la barra lateral)
function ReservasSection({ recurso }) {
  const { items: reservas, cargando, recargar, crear, eliminar } = recurso;
  const [mensaje, mostrarMensaje] = useMensajeTemporal(4000);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

  const reservaDeMesa = numero => reservas.find(r => r.idMesa === numero);

  const handleCrear = async dto => {
    try {
      await crear(dto);
      mostrarMensaje(`✅ Mesa ${dto.idMesa} reservada con éxito.`);
      setMesaSeleccionada(null);
    } catch (error) {
      mostrarMensaje(`❌ ${mensajeDeError(error, 'No se pudo guardar la reserva.')}`, 'error');
    }
  };

  const handleLiberar = async id => {
    if (!window.confirm('¿Quieres dar por finalizada la estancia de esta mesa y dejarla VACÍA de nuevo?')) return;
    try {
      await eliminar(id);
      mostrarMensaje('🗑️ Mesa liberada correctamente.');
      setMesaSeleccionada(null);
    } catch (error) {
      mostrarMensaje(`❌ ${mensajeDeError(error, 'No se pudo liberar la mesa.')}`, 'error');
    }
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#4a3319] font-serif">🗺️ Croquis Plano de Mesas</h2>
          <p className="text-xs md:text-sm text-gray-500 italic mt-0.5 font-sans">
            Selecciona una mesa o espacio libre para asignar, o pulsa una ocupada para liberarla.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap sm:justify-end">
          <button type="button" onClick={() => recargar().catch(() => mostrarMensaje('❌ No se pudo refrescar.', 'error'))} className="py-2 px-4 bg-white border border-[#e6dfd5] hover:bg-gray-50 text-xs font-bold uppercase tracking-wider text-[#4a3319] rounded-lg shadow-xs transition-colors">
            🔄 Refrescar Estado
          </button>
          <button type="button" onClick={() => exportarReservasPDF(reservas)} className="py-2 px-4 bg-[#4a3319] text-white text-xs font-bold uppercase rounded-lg shadow hover:bg-[#614424]">
            📄 Exportar PDF
          </button>
        </div>
      </div>

      <MensajeEstado mensaje={mensaje} className="mb-6" />

      {cargando ? (
        <p className="text-center text-gray-400 italic text-sm py-16">Cargando la disposición física de las mesas...</p>
      ) : (
        <div className="flex flex-col gap-8">
          {ZONAS.map(zona => {
            const mesasZona = MESAS.filter(m => m.zona === zona.id);
            return (
              <div key={zona.id} className="bg-white border border-[#e6dfd5] p-4 rounded-xl shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#614424] mb-3 border-b border-gray-100 pb-2 flex items-center gap-2">
                  {zona.titulo} <span className="bg-amber-100 text-[#4a3319] px-2 py-0.5 rounded-full text-[10px]">{mesasZona.length} {zona.unidad}</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {mesasZona.map(mesa => (
                    <MesaCard key={mesa.numero} mesa={mesa} reserva={reservaDeMesa(mesa.numero)} onClick={() => setMesaSeleccionada(mesa)} />
                  ))}
                </div>
              </div>
            );
          })}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 bg-white p-4 border border-[#e6dfd5] rounded-xl text-[11px] font-bold uppercase tracking-wider text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-600 rounded-full inline-block"></span>
              Espacios Disponibles ({MESAS.length - reservas.length})
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-600 rounded-full inline-block"></span>
              Espacios Ocupados ({reservas.length} / {MESAS.length})
            </div>
          </div>
        </div>
      )}

      {mesaSeleccionada && (
        <ReservaModal
          key={mesaSeleccionada.numero}
          mesa={mesaSeleccionada}
          reserva={reservaDeMesa(mesaSeleccionada.numero)}
          onCerrar={() => setMesaSeleccionada(null)}
          onCrear={handleCrear}
          onLiberar={handleLiberar}
        />
      )}
    </div>
  );
}

ReservasSection.propTypes = {
  recurso: PropTypes.shape({
    items: PropTypes.array.isRequired,
    cargando: PropTypes.bool.isRequired,
    recargar: PropTypes.func.isRequired,
    crear: PropTypes.func.isRequired,
    eliminar: PropTypes.func.isRequired,
  }).isRequired,
};

export default ReservasSection;
