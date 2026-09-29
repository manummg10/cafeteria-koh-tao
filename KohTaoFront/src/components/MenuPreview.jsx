import { useState } from 'react';
import { useApiResource } from '../hooks/useApiResource';

function MenuPreview() {
  const { items: productos, cargando: loading } = useApiResource('/api/productos');
  const [categoriaActiva, setCategoriaActiva] = useState('Cafés');

  const mapearCategoria = (tab) => {
    if (tab === 'Tartas') return 'Dulces';
    if (tab === 'Salado') return 'Otros';
    return 'Cafés';
  };

  const productosFiltrados = productos.filter(
    p => p.categoria === mapearCategoria(categoriaActiva)
  );

  if (loading) {
    return (
      <div className="text-center py-16 font-serif italic text-sm text-[#7d7065] bg-[#f6f1eb] tracking-wide">
        Cargando deliciosa carta...
      </div>
    );
  }

  return (
    <section id="Nuestra Carta"
    className="w-full bg-[#f6f1eb] py-20 px-5 transition-all duration-500">
      <div className="w-full max-w-[900px] mx-auto">
        
        {/* Cabecera */}
        <div className="text-center mb-10">
          <span className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-[#8c7662] block mb-2">
            Nuestra Carta
          </span>
          <h2 className="text-2xl md:text-3xl font-serif italic text-[#2c2520] tracking-wide">
            Desayunos & Meriendas
          </h2>
          <div className="w-12 h-[1px] bg-[#8c7662]/40 mx-auto mt-4"></div>
        </div>

        {/* 📱 PESTAÑAS DE FILTRO */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'Cafés', label: 'Cafés', emoji: '☕' },
            { id: 'Tartas', label: 'Tartas', emoji: '🍰' },
            { id: 'Salado', label: 'Salado', emoji: '🥪' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCategoriaActiva(tab.id)}
              className={`flex items-center gap-2 py-2.5 px-6 rounded-full text-xs font-semibold font-sans uppercase tracking-widest border shadow-sm transition-all duration-300 ${
                categoriaActiva === tab.id 
                  ? 'bg-[#2c2520] border-[#2c2520] text-white scale-103' 
                  : 'bg-white border-[#e6dfd5] text-[#8c7662] hover:bg-[#2c2520] hover:text-white hover:border-[#2c2520]'
              }`}
            >
              <span className="text-sm">{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* LISTADO ESTILO MENÚ ARTESANAL */}
        <div className="w-full text-left animate-[fadeIn_0.4s_ease-in-out]">
          {productosFiltrados.length === 0 ? (
            <p className="text-center text-[#7d7065]/70 font-serif italic py-8">No hay productos disponibles en esta sección ahora mismo.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {productosFiltrados.map(producto => (
                <div key={producto.id} className="flex flex-col w-full group">
                  
                  {/* Fila principal: Nombre .................... Precio */}
                  <div className="flex justify-between items-end w-full mb-1">
                    {/* Nombre del plato */}
                    <span className="text-sm md:text-base font-semibold font-sans uppercase tracking-wider text-[#2c2520] whitespace-nowrap bg-[#f6f1eb] z-10 pr-2 group-hover:text-[#8c7662] transition-colors duration-300">
                      {producto.nombre}
                    </span>

                    {/* Línea de puntos dinámica que rellena el espacio */}
                    <div className="flex-grow border-b border-dotted border-[#c3b7ac] mx-3 relative -top-1.5"></div>

                    {/* Precio */}
                    <span className="text-sm md:text-base font-semibold font-sans text-[#2c2520] bg-[#f6f1eb] z-10 pl-2">
                      {producto.precio.toFixed(2)}€
                    </span>
                  </div>

                  {/* Descripción / Ingredientes (Solo si tiene datos) */}
                  {producto.descripcion && (
                    <p className="text-xs md:text-sm text-[#7d7065] font-serif italic max-w-[85%] md:max-w-[80%] leading-relaxed">
                      {producto.descripcion}
                    </p>
                  )}
                  
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default MenuPreview;