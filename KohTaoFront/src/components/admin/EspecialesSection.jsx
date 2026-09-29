import { useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { useApiResource } from '../../hooks/useApiResource';
import { useFormularioEdicion } from '../../hooks/useFormularioEdicion';
import { useMensajeTemporal } from '../../hooks/useMensajeTemporal';
import {
  PanelCard, CampoFormulario, MensajeEstado, ItemFila, ListaItems, BotonesFormulario,
  inputClase,
} from './ui/AdminUI';
import { mensajeDeError } from './ui/mensajeDeError';

const VALORES_INICIALES = { nombre: '', precio: '', descripcion: '', imagenUrl: '' };
const OPCIONES_COMPRESION = { maxSizeMB: 0.3, maxWidthOrHeight: 500, useWebWorker: true, fileType: 'image/webp' };

function EspecialesSection() {
  const { items: tartas, cargando, crear, actualizar, eliminar } = useApiResource('/api/tartasespeciales');
  const { valores, cambiar, idEditar, editar, reiniciar } = useFormularioEdicion(VALORES_INICIALES);
  const [mensaje, mostrarMensaje] = useMensajeTemporal();
  const [enviando, setEnviando] = useState(false);
  const inputArchivo = useRef(null);

  const reiniciarTodo = () => {
    reiniciar();
    if (inputArchivo.current) inputArchivo.current.value = '';
  };

  const manejarCambioImagen = async e => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    try {
      mostrarMensaje('⏳ Comprimiendo imagen...');
      const comprimido = await imageCompression(archivo, OPCIONES_COMPRESION);
      cambiar('imagenUrl')(await imageCompression.getDataUrlFromFile(comprimido));
    } catch {
      mostrarMensaje('❌ Error al procesar la imagen.', 'error');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!valores.nombre || !valores.precio) {
      mostrarMensaje('❌ El nombre y el precio son obligatorios.', 'error');
      return;
    }
    const dto = { ...valores, precio: Number.parseFloat(valores.precio), imagenUrl: valores.imagenUrl || null };
    setEnviando(true);
    try {
      if (idEditar) await actualizar(idEditar, dto);
      else await crear(dto);
      mostrarMensaje(idEditar ? '✅ ¡Tarta especial actualizada!' : '✅ ¡Tarta especial añadida con éxito!');
      reiniciarTodo();
    } catch (error) {
      mostrarMensaje(`❌ ${mensajeDeError(error, 'Error al guardar la tarta.')}`, 'error');
    } finally {
      setEnviando(false);
    }
  };

  const handleBorrar = async id => {
    if (!window.confirm('¿Seguro que quieres eliminar esta tarta de las tentaciones del día?')) return;
    try {
      await eliminar(id);
      mostrarMensaje('🗑️ Tarta eliminada correctamente.');
      if (idEditar === id) reiniciarTodo();
    } catch (error) {
      mostrarMensaje(`❌ ${mensajeDeError(error, 'Error al eliminar la tarta.')}`, 'error');
    }
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out]">
      <h2 className="text-2xl md:text-3xl font-bold text-[#4a3319] mb-6 font-serif">⭐ Gestión de Tartas Especiales</h2>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <PanelCard
          className="lg:col-span-5"
          titulo={idEditar ? 'Modificar Tarta Especial' : 'Añadir Nueva Tentación'}
          cabeceraClase={idEditar ? 'bg-[#d4b285] text-[#4a3319]' : 'bg-[#4a3319] text-white'}
        >
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            <CampoFormulario label="Nombre de la Tarta *" htmlFor="tarta-nombre">
              <input id="tarta-nombre" type="text" maxLength={100} value={valores.nombre} onChange={cambiar('nombre')} placeholder="Ej. Tarta de Loto" className={inputClase} />
            </CampoFormulario>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CampoFormulario label="Precio (€) *" htmlFor="tarta-precio">
                <input id="tarta-precio" type="number" step="0.01" min="0" value={valores.precio} onChange={cambiar('precio')} placeholder="0.00" className={inputClase} />
              </CampoFormulario>
              <CampoFormulario label="Imagen" htmlFor="tarta-imagen">
                <input id="tarta-imagen" ref={inputArchivo} type="file" accept="image/png,image/jpeg,image/webp" onChange={manejarCambioImagen} className="w-full p-1.5 rounded-lg border border-[#dcd3c6] bg-white text-xs cursor-pointer" />
              </CampoFormulario>
            </div>
            <CampoFormulario label="Descripción" htmlFor="tarta-descripcion">
              <textarea id="tarta-descripcion" maxLength={1000} value={valores.descripcion} onChange={cambiar('descripcion')} placeholder="Detalles..." rows="3" className={`${inputClase} resize-none`} />
            </CampoFormulario>
            {valores.imagenUrl && (
              <div className="flex flex-col items-center p-2 border border-dashed border-[#dcd3c6] rounded-lg bg-gray-50">
                <img src={valores.imagenUrl} alt="Vista previa" className="h-20 object-cover rounded" />
              </div>
            )}
            <BotonesFormulario
              editando={!!idEditar}
              enviando={enviando}
              textoCrear="Subir Tentación"
              claseBoton="bg-[#4a3319] hover:bg-[#614424] text-white"
              onCancelar={reiniciarTodo}
            />
            <MensajeEstado mensaje={mensaje} />
          </form>
        </PanelCard>

        <PanelCard className="lg:col-span-7" titulo={`🍰 Especiales en Base de Datos (${tartas.length})`} cabeceraClase="bg-[#4a3319] text-white">
          <ListaItems cargando={cargando}>
            {tartas.map(t => (
              <ItemFila
                key={t.id}
                fondoClase="bg-[#4a3319]"
                miniatura={
                  <div className="w-12 h-12 overflow-hidden flex items-center justify-center border border-white/20 rounded-lg">
                    <img src={t.imagenUrl || '/default-cake.jpg'} alt={t.nombre} className="w-full h-full object-cover" />
                  </div>
                }
                titulo={t.nombre}
                subtitulo={t.descripcion}
                precio={t.precio}
                onEditar={() => editar(t.id, { nombre: t.nombre, precio: t.precio, descripcion: t.descripcion ?? '', imagenUrl: t.imagenUrl ?? '' })}
                onBorrar={() => handleBorrar(t.id)}
              />
            ))}
          </ListaItems>
        </PanelCard>
      </div>
    </div>
  );
}

export default EspecialesSection;
