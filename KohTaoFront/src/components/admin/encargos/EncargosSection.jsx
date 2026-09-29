import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../../services/api';
import { useApiResource } from '../../../hooks/useApiResource';
import { useFormularioEdicion } from '../../../hooks/useFormularioEdicion';
import { useMensajeTemporal } from '../../../hooks/useMensajeTemporal';
import { aInputFechaHora } from '../../../utils/fecha';
import { PanelCard, CampoFormulario, MensajeEstado, ListaItems, BotonesFormulario, inputClase } from '../ui/AdminUI';
import { mensajeDeError } from '../ui/mensajeDeError';
import { FILTROS } from './estados';
import LineasEncargoEditor from './LineasEncargoEditor';
import EncargoCard from './EncargoCard';
import { exportarEncargosPDF } from './exportarEncargosPDF';

const ENDPOINT = '/api/encargos';
const VALORES_INICIALES = { cliente: '', telefono: '', email: '', fechaRecogida: '', notas: '', lineas: [] };

// Recibe el recurso desde el Dashboard (comparte el contador de encargos activos con la barra lateral)
function EncargosSection({ recurso }) {
  const { items: encargos, cargando, recargar, crear, actualizar, eliminar } = recurso;
  const { items: productos } = useApiResource('/api/productos');
  const { items: tartas } = useApiResource('/api/tartasespeciales');
  const { valores, cambiar, idEditar, editar, reiniciar } = useFormularioEdicion(VALORES_INICIALES);
  const [mensaje, mostrarMensaje] = useMensajeTemporal(4000);
  const [filtro, setFiltro] = useState('activos');
  const [enviando, setEnviando] = useState(false);

  const filtroActivo = FILTROS.find(f => f.id === filtro);
  const visibles = encargos.filter(filtroActivo.coincide);

  const handleSubmit = async e => {
    e.preventDefault();
    if (valores.lineas.length === 0 && !valores.notas.trim()) {
      mostrarMensaje('❌ Añade al menos un producto o describe el encargo en las notas.', 'error');
      return;
    }
    // Solo se envían ids y cantidades: el servidor pone nombres y precios de la carta
    const dto = {
      cliente: valores.cliente,
      telefono: valores.telefono,
      email: valores.email || null,
      fechaRecogida: `${valores.fechaRecogida}:00`,
      notas: valores.notas || null,
      lineas: valores.lineas.map(({ tipo, productoId, cantidad }) => ({ tipo, productoId, cantidad })),
    };
    setEnviando(true);
    try {
      if (idEditar) await actualizar(idEditar, dto);
      else await crear(dto);
      mostrarMensaje(idEditar ? '✅ Encargo actualizado.' : '✅ Encargo registrado.');
      reiniciar();
    } catch (error) {
      mostrarMensaje(`❌ ${mensajeDeError(error, 'No se pudo guardar el encargo.')}`, 'error');
    } finally {
      setEnviando(false);
    }
  };

  const handleEditar = enc => {
    editar(enc.id, {
      cliente: enc.cliente,
      telefono: enc.telefono,
      email: enc.email ?? '',
      fechaRecogida: aInputFechaHora(enc.fechaRecogida),
      notas: enc.notas ?? '',
      lineas: enc.lineas,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCambiarEstado = async (enc, estado) => {
    try {
      await api.put(`${ENDPOINT}/${enc.id}/estado`, { estado });
      await recargar();
      mostrarMensaje(`✅ Encargo de ${enc.cliente}: ${estado}.`);
    } catch (error) {
      mostrarMensaje(`❌ ${mensajeDeError(error, 'No se pudo cambiar el estado.')}`, 'error');
    }
  };

  const handleBorrar = async enc => {
    if (!window.confirm(`¿Eliminar el encargo de ${enc.cliente}? Si solo no se va a hacer, mejor márcalo como Cancelado.`)) return;
    try {
      await eliminar(enc.id);
      mostrarMensaje('🗑️ Encargo eliminado.');
      if (idEditar === enc.id) reiniciar();
    } catch (error) {
      mostrarMensaje(`❌ ${mensajeDeError(error, 'No se pudo eliminar el encargo.')}`, 'error');
    }
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#4a3319] font-serif">🧁 Encargos</h2>
        <div className="flex gap-2 flex-wrap">
          <button type="button" onClick={() => recargar().catch(() => mostrarMensaje('❌ No se pudo refrescar.', 'error'))} className="py-2 px-4 bg-white border border-[#e6dfd5] hover:bg-gray-50 text-xs font-bold uppercase tracking-wider text-[#4a3319] rounded-lg">
            🔄 Refrescar
          </button>
          <button type="button" onClick={() => exportarEncargosPDF(visibles, `Encargos · ${filtroActivo.etiqueta}`)} disabled={visibles.length === 0} className="py-2 px-4 bg-[#4a3319] text-white text-xs font-bold uppercase rounded-lg hover:bg-[#614424] disabled:opacity-40">
            📄 Exportar PDF
          </button>
        </div>
      </div>

      <MensajeEstado mensaje={mensaje} className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <PanelCard
          className="lg:col-span-5"
          titulo={idEditar ? 'Modificar Encargo' : 'Nuevo Encargo'}
          cabeceraClase={idEditar ? 'bg-[#d4b285] text-[#4a3319]' : 'bg-[#614424] text-white'}
        >
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            <CampoFormulario label="Nombre del cliente *" htmlFor="encargo-cliente">
              <input id="encargo-cliente" type="text" required maxLength={100} value={valores.cliente} onChange={cambiar('cliente')} placeholder="Ej. Ana García" className={inputClase} />
            </CampoFormulario>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CampoFormulario label="Teléfono *" htmlFor="encargo-telefono">
                <input id="encargo-telefono" type="tel" required maxLength={20} value={valores.telefono} onChange={cambiar('telefono')} placeholder="600 000 000" className={inputClase} />
              </CampoFormulario>
              <CampoFormulario label="Email" htmlFor="encargo-email">
                <input id="encargo-email" type="email" maxLength={254} value={valores.email} onChange={cambiar('email')} placeholder="Opcional" className={inputClase} />
              </CampoFormulario>
            </div>
            <CampoFormulario label="Fecha y hora de recogida *" htmlFor="encargo-fecha">
              <input id="encargo-fecha" type="datetime-local" required value={valores.fechaRecogida} onChange={cambiar('fechaRecogida')} className={inputClase} />
            </CampoFormulario>
            <CampoFormulario label="Productos">
              <LineasEncargoEditor lineas={valores.lineas} onChange={cambiar('lineas')} productos={productos} tartas={tartas} />
            </CampoFormulario>
            <CampoFormulario label="Notas" htmlFor="encargo-notas">
              <textarea id="encargo-notas" rows="3" maxLength={1000} value={valores.notas} onChange={cambiar('notas')} placeholder="Ej. Tarta de 12 raciones, escribir 'Feliz cumple Ana'" className={`${inputClase} resize-none`} />
            </CampoFormulario>
            <BotonesFormulario
              editando={!!idEditar}
              enviando={enviando}
              textoCrear="Registrar Encargo"
              claseBoton={idEditar ? 'bg-[#d4b285] text-[#4a3319]' : 'bg-[#614424] text-white'}
              onCancelar={reiniciar}
            />
          </form>
        </PanelCard>

        <PanelCard className="lg:col-span-7" titulo={`📋 ${filtroActivo.etiqueta} (${visibles.length})`}>
          <div className="flex flex-wrap gap-2 p-3 bg-[#fdfbf7] border-b border-gray-100">
            {FILTROS.map(f => (
              <button key={f.id} type="button" onClick={() => setFiltro(f.id)} className={`py-1.5 px-3 rounded-full font-bold text-xs border ${filtro === f.id ? 'bg-[#614424] text-white' : 'bg-white text-[#614424]'}`}>
                {f.etiqueta} ({encargos.filter(f.coincide).length})
              </button>
            ))}
          </div>
          <ListaItems cargando={cargando}>
            {visibles.length === 0 && <p className="text-center text-gray-400 italic text-sm py-8">No hay encargos en esta vista.</p>}
            {visibles.map(enc => (
              <EncargoCard
                key={enc.id}
                encargo={enc}
                onEditar={() => handleEditar(enc)}
                onBorrar={() => handleBorrar(enc)}
                onCambiarEstado={estado => handleCambiarEstado(enc, estado)}
              />
            ))}
          </ListaItems>
        </PanelCard>
      </div>
    </div>
  );
}

EncargosSection.propTypes = {
  recurso: PropTypes.shape({
    items: PropTypes.array.isRequired,
    cargando: PropTypes.bool.isRequired,
    recargar: PropTypes.func.isRequired,
    crear: PropTypes.func.isRequired,
    actualizar: PropTypes.func.isRequired,
    eliminar: PropTypes.func.isRequired,
  }).isRequired,
};

export default EncargosSection;
