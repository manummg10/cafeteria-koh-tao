import { useState } from 'react';
import { Coffee, Cake, Utensils } from 'lucide-react';
import { useApiResource } from '../../hooks/useApiResource';
import { useFormularioEdicion } from '../../hooks/useFormularioEdicion';
import { useMensajeTemporal } from '../../hooks/useMensajeTemporal';
import {
  PanelCard, CampoFormulario, MensajeEstado, ItemFila, ListaItems, BotonesFormulario,
  inputClase,
} from './ui/AdminUI';
import { mensajeDeError } from './ui/mensajeDeError';

const VALORES_INICIALES = { nombre: '', precio: '', categoria: 'Cafés', descripcion: '' };
const PESTANAS = ['Todos', 'Cafés', 'Dulces', 'Salados'];

const iconoCategoria = categoria => {
  if (categoria === 'Cafés') return <Coffee size={16} className="text-[#d4b285]" />;
  if (categoria === 'Dulces') return <Cake size={16} className="text-[#e6dfd5]" />;
  return <Utensils size={16} />;
};

function CartaSection() {
  const { items: productos, cargando, crear, actualizar, eliminar } = useApiResource('/api/productos');
  const { valores, cambiar, idEditar, editar, reiniciar } = useFormularioEdicion(VALORES_INICIALES);
  const [mensaje, mostrarMensaje] = useMensajeTemporal();
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [enviando, setEnviando] = useState(false);

  const productosFiltrados = productos.filter(p =>
    categoriaActiva === 'Todos' || p.categoria === (categoriaActiva === 'Salados' ? 'Otros' : categoriaActiva)
  );

  const handleSubmit = async e => {
    e.preventDefault();
    if (!valores.nombre || !valores.precio) {
      mostrarMensaje('❌ Rellena los campos obligatorios.', 'error');
      return;
    }
    const dto = { ...valores, precio: Number.parseFloat(valores.precio) };
    setEnviando(true);
    try {
      if (idEditar) await actualizar(idEditar, dto);
      else await crear(dto);
      mostrarMensaje(idEditar ? '✅ ¡Producto actualizado con éxito!' : '✅ ¡Producto añadido con éxito!');
      reiniciar();
    } catch (error) {
      mostrarMensaje(`❌ ${mensajeDeError(error, 'Error al guardar el producto.')}`, 'error');
    } finally {
      setEnviando(false);
    }
  };

  const handleBorrar = async id => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto de la carta?')) return;
    try {
      await eliminar(id);
      mostrarMensaje('🗑️ Producto eliminado.');
      if (idEditar === id) reiniciar();
    } catch (error) {
      mostrarMensaje(`❌ ${mensajeDeError(error, 'Error al eliminar el producto.')}`, 'error');
    }
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out]">
      <h2 className="text-2xl md:text-3xl font-bold text-[#4a3319] mb-6 font-serif">📋 Gestión de la Carta General</h2>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <PanelCard
          className="lg:col-span-5"
          titulo={idEditar ? 'Modificar Producto' : 'Añadir Nuevo Producto'}
          cabeceraClase={idEditar ? 'bg-[#d4b285] text-[#4a3319]' : 'bg-[#614424] text-white'}
        >
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            <CampoFormulario label="Nombre del producto *" htmlFor="producto-nombre">
              <input id="producto-nombre" type="text" maxLength={100} value={valores.nombre} onChange={cambiar('nombre')} placeholder="Ej. Flat White" className={inputClase} />
            </CampoFormulario>
            <div className="grid grid-cols-2 gap-4">
              <CampoFormulario label="Precio (€) *" htmlFor="producto-precio">
                <input id="producto-precio" type="number" step="0.01" min="0" value={valores.precio} onChange={cambiar('precio')} placeholder="0.00" className={inputClase} />
              </CampoFormulario>
              <CampoFormulario label="Categoría" htmlFor="producto-categoria">
                <select id="producto-categoria" value={valores.categoria} onChange={cambiar('categoria')} className={`${inputClase} bg-white font-medium`}>
                  <option value="Cafés">Cafés</option>
                  <option value="Dulces">Dulces (Tartas)</option>
                  <option value="Otros">Salados / Otros</option>
                </select>
              </CampoFormulario>
            </div>
            <CampoFormulario label="Descripción" htmlFor="producto-descripcion">
              <textarea id="producto-descripcion" maxLength={1000} value={valores.descripcion} onChange={cambiar('descripcion')} placeholder="Detalles..." rows="3" className={`${inputClase} resize-none`} />
            </CampoFormulario>
            <BotonesFormulario
              editando={!!idEditar}
              enviando={enviando}
              textoCrear="Guardar en la Carta"
              claseBoton={idEditar ? 'bg-[#d4b285] text-[#4a3319]' : 'bg-[#614424] text-white'}
              onCancelar={reiniciar}
            />
            <MensajeEstado mensaje={mensaje} />
          </form>
        </PanelCard>

        <PanelCard className="lg:col-span-7" titulo={`📋 Productos registrados (${productosFiltrados.length})`}>
          <div className="flex flex-wrap gap-2 p-3 bg-[#fdfbf7] border-b border-gray-100">
            {PESTANAS.map(tab => (
              <button key={tab} type="button" onClick={() => setCategoriaActiva(tab)} className={`py-1.5 px-4 rounded-full font-bold text-xs border ${categoriaActiva === tab ? 'bg-[#614424] text-white' : 'bg-white text-[#614424]'}`}>{tab}</button>
            ))}
          </div>
          <ListaItems cargando={cargando}>
            {productosFiltrados.map(p => (
              <ItemFila
                key={p.id}
                miniatura={<div className="bg-white/15 p-2 rounded-lg">{iconoCategoria(p.categoria)}</div>}
                titulo={p.nombre}
                subtitulo={p.descripcion}
                precio={p.precio}
                onEditar={() => editar(p.id, { nombre: p.nombre, precio: p.precio, categoria: p.categoria, descripcion: p.descripcion ?? '' })}
                onBorrar={() => handleBorrar(p.id)}
              />
            ))}
          </ListaItems>
        </PanelCard>
      </div>
    </div>
  );
}

export default CartaSection;
