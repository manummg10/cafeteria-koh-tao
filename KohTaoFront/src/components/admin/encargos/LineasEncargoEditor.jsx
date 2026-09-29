import { useState } from 'react';
import PropTypes from 'prop-types';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { inputClase } from '../ui/AdminUI';
import { euros } from './estados';

const clave = (tipo, id) => `${tipo}-${id}`;

// Selector de productos de la carta y tartas con cantidades. El precio mostrado es orientativo:
// el total definitivo lo calcula el servidor con los precios de la carta.
function LineasEncargoEditor({ lineas, onChange, productos, tartas }) {
  const [seleccion, setSeleccion] = useState('');
  const catalogo = [
    ...productos.map(p => ({ tipo: 'Producto', productoId: p.id, nombre: p.nombre, precioUnitario: p.precio })),
    ...tartas.map(t => ({ tipo: 'Tarta', productoId: t.id, nombre: t.nombre, precioUnitario: t.precio })),
  ];

  const anadir = () => {
    const item = catalogo.find(c => clave(c.tipo, c.productoId) === seleccion);
    if (!item) return;
    const existente = lineas.find(l => clave(l.tipo, l.productoId) === seleccion);
    onChange(existente
      ? lineas.map(l => (l === existente ? { ...l, cantidad: Math.min(l.cantidad + 1, 99) } : l))
      : [...lineas, { ...item, cantidad: 1 }]);
    setSeleccion('');
  };

  const cambiarCantidad = (linea, delta) => onChange(
    lineas.map(l => (l === linea ? { ...l, cantidad: Math.min(Math.max(l.cantidad + delta, 1), 99) } : l))
  );

  const total = lineas.reduce((s, l) => s + l.precioUnitario * l.cantidad, 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <select aria-label="Producto a añadir" value={seleccion} onChange={e => setSeleccion(e.target.value)} className={`${inputClase} bg-white`}>
          <option value="">Elige un producto...</option>
          <optgroup label="Carta">
            {productos.map(p => <option key={p.id} value={clave('Producto', p.id)}>{p.nombre} · {euros(p.precio)}</option>)}
          </optgroup>
          <optgroup label="Tartas especiales">
            {tartas.map(t => <option key={t.id} value={clave('Tarta', t.id)}>{t.nombre} · {euros(t.precio)}</option>)}
          </optgroup>
        </select>
        <button type="button" onClick={anadir} disabled={!seleccion} className="px-4 rounded-lg bg-[#614424] text-white text-xs font-bold uppercase disabled:opacity-40">Añadir</button>
      </div>

      {lineas.length > 0 && (
        <ul className="flex flex-col gap-1.5 mt-1">
          {lineas.map(l => (
            <li key={clave(l.tipo, l.productoId)} className="flex items-center gap-2 p-2 rounded-lg bg-[#fdfbf7] border border-[#e6dfd5] text-sm">
              <span className="flex-grow truncate">{l.nombre}</span>
              <button type="button" aria-label={`Quitar uno de ${l.nombre}`} onClick={() => cambiarCantidad(l, -1)} className="p-1 rounded bg-gray-100"><Minus size={12} /></button>
              <span className="w-6 text-center font-bold">{l.cantidad}</span>
              <button type="button" aria-label={`Añadir uno de ${l.nombre}`} onClick={() => cambiarCantidad(l, 1)} className="p-1 rounded bg-gray-100"><Plus size={12} /></button>
              <span className="w-16 text-right text-xs text-gray-500">{euros(l.precioUnitario * l.cantidad)}</span>
              <button type="button" aria-label={`Eliminar ${l.nombre}`} onClick={() => onChange(lineas.filter(x => x !== l))} className="p-1 rounded text-red-600"><Trash2 size={14} /></button>
            </li>
          ))}
          <li className="text-right text-sm font-bold text-[#4a3319] pr-8">Total estimado: {euros(total)}</li>
        </ul>
      )}
    </div>
  );
}

const lineaShape = PropTypes.shape({
  tipo: PropTypes.string.isRequired,
  productoId: PropTypes.number.isRequired,
  nombre: PropTypes.string.isRequired,
  precioUnitario: PropTypes.number.isRequired,
  cantidad: PropTypes.number.isRequired,
});

LineasEncargoEditor.propTypes = {
  lineas: PropTypes.arrayOf(lineaShape).isRequired,
  onChange: PropTypes.func.isRequired,
  productos: PropTypes.array.isRequired,
  tartas: PropTypes.array.isRequired,
};

export default LineasEncargoEditor;
