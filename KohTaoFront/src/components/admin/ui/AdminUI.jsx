import PropTypes from 'prop-types';
import { Edit2, Trash2 } from 'lucide-react';

export const inputClase = 'w-full p-2.5 rounded-lg border border-[#dcd3c6] text-sm text-[#2c2520] focus:outline-none';
export const labelClase = 'block mb-1.5 text-xs font-bold uppercase tracking-wider text-[#4a3319]';

// Tarjeta con cabecera de color usada por formularios y listados del panel
export function PanelCard({ titulo, cabeceraClase = 'bg-[#614424] text-white', className = '', children }) {
  return (
    <section className={`bg-white border border-[#e6dfd5] rounded-xl overflow-hidden shadow-sm ${className}`}>
      <div className={`p-4 font-bold text-base md:text-lg font-serif tracking-wide ${cabeceraClase}`}>{titulo}</div>
      {children}
    </section>
  );
}

PanelCard.propTypes = {
  titulo: PropTypes.node.isRequired,
  cabeceraClase: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export function CampoFormulario({ label, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClase}>{label}</label>
      {children}
    </div>
  );
}

CampoFormulario.propTypes = {
  label: PropTypes.string.isRequired,
  htmlFor: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export function MensajeEstado({ mensaje, className = '' }) {
  if (!mensaje) return null;
  const esError = mensaje.tipo === 'error';
  return (
    <p role="status" className={`p-3 rounded-xl text-center text-sm font-bold border ${esError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'} ${className}`}>
      {mensaje.texto}
    </p>
  );
}

MensajeEstado.propTypes = {
  mensaje: PropTypes.shape({ texto: PropTypes.string, tipo: PropTypes.oneOf(['ok', 'error']) }),
  className: PropTypes.string,
};

// Fila de listado con miniatura/icono, título, descripción, precio y acciones
export function ItemFila({ miniatura, titulo, subtitulo, precio, fondoClase = 'bg-[#614424]', onEditar, onBorrar }) {
  return (
    <div className={`flex justify-between items-center p-3.5 text-white rounded-xl ${fondoClase}`}>
      <div className="flex items-center gap-3 w-8/12">
        {miniatura}
        <div className="overflow-hidden">
          <strong className="block text-sm font-semibold truncate text-white">{titulo}</strong>
          <span className="text-xs text-[#e6dfd5]/80 block truncate font-normal">{subtitulo || 'Sin descripción'}</span>
        </div>
      </div>
      <div className="flex gap-2 items-center shrink-0">
        <span className="font-bold text-sm text-[#d4b285] mr-1">{Number(precio).toFixed(2)}€</span>
        <button type="button" onClick={onEditar} aria-label={`Editar ${titulo}`} className="bg-white/20 p-2 rounded-md"><Edit2 size={14} /></button>
        <button type="button" onClick={onBorrar} aria-label={`Eliminar ${titulo}`} className="bg-red-600 p-2 rounded-md"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}

ItemFila.propTypes = {
  miniatura: PropTypes.node,
  titulo: PropTypes.string.isRequired,
  subtitulo: PropTypes.string,
  precio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  fondoClase: PropTypes.string,
  onEditar: PropTypes.func.isRequired,
  onBorrar: PropTypes.func.isRequired,
};

// Listado con estado de carga
export function ListaItems({ cargando, children }) {
  return (
    <div className="p-4 flex flex-col gap-3 max-h-[500px] overflow-y-auto">
      {cargando ? <p className="text-center text-gray-400 italic text-sm">Cargando...</p> : children}
    </div>
  );
}

ListaItems.propTypes = {
  cargando: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export function BotonesFormulario({ editando, textoCrear, textoEditar = 'Guardar Cambios', claseBoton, enviando = false, onCancelar }) {
  return (
    <div className="flex gap-3 mt-2">
      <button type="submit" disabled={enviando} className={`flex-grow p-3 rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-60 ${claseBoton}`}>
        {editando ? textoEditar : textoCrear}
      </button>
      {editando && (
        <button type="button" onClick={onCancelar} className="p-3 bg-gray-100 text-gray-700 font-bold rounded-lg text-xs">Cancelar</button>
      )}
    </div>
  );
}

BotonesFormulario.propTypes = {
  editando: PropTypes.bool.isRequired,
  textoCrear: PropTypes.string.isRequired,
  textoEditar: PropTypes.string,
  claseBoton: PropTypes.string,
  enviando: PropTypes.bool,
  onCancelar: PropTypes.func.isRequired,
};

