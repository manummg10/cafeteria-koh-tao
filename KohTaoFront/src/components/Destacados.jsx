import { useState, useEffect } from 'react';

function Destacados() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // 🔄 Llamada al endpoint de Tartas Especiales en .NET
  useEffect(() => {
    fetch('http://localhost:5041/api/tartasespeciales')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar las tentaciones del día.');
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setCargando(false);
      });
  }, []);

  return (
    <section id="Tentaciones del día" className="w-full max-w-[1200px] mx-auto py-20 px-5 font-sans">
      
      {/* Cabecera de la sección */}
      <div className="text-center mb-12">
        <span className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-[#8c7662] block mb-2">
          Tentaciones del día
        </span>
        <h2 className="text-2xl md:text-3xl font-serif italic text-[#2c2520] tracking-wide">
          Los Especiales de KOH TAO
        </h2>
        <div className="w-12 h-[1px] bg-[#8c7662]/40 mx-auto mt-4"></div>
      </div>

      {/* Estado de carga */}
      {cargando && (
        <div className="text-center text-[#6e6359] font-serif italic text-sm py-10 tracking-wide">
          Preparando los dulces del día...
        </div>
      )}

      {/* Estado de error */}
      {error && !cargando && (
        <div className="text-center text-red-700 font-sans text-xs uppercase tracking-wider py-10">
          {error}
        </div>
      )}

      {/* 📱 REJILLA RESPONSIVE CON DATOS DEL BACKEND */}
      {!cargando && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((prod) => (
            <div 
              key={prod.id} 
              className="group bg-[#fcfaf7] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(44,37,32,0.06)] border border-[#e6dfd5]/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(44,37,32,0.12)] hover:border-[#4a3319]/30"
            >
              {/* Contenedor de la Imagen con fondo estético y simetría total */}
              <div className="relative w-full h-60 overflow-hidden bg-gradient-to-b from-[#f5f0ea] to-[#ebdccb]/45 flex items-center justify-center p-4 border-b border-[#e6dfd5]/50">
                
                {/* Imagen de la tarta: siempre entera, centrada y sin deformarse */}
                <img 
                  src={prod.imagenUrl || '/default-cake.jpg'} 
                  alt={prod.nombre} 
                  style={{ 
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                  className="transition-transform duration-500 ease-out group-hover:scale-103 drop-shadow-[0_6px_12px_rgba(44,37,32,0.15)]"
                />

                {/* Etiqueta de precio flotante */}
                <span className="absolute top-4 right-4 bg-[#2c2520] text-white py-1.5 px-3 text-[11px] font-semibold rounded-full font-sans tracking-wider shadow-sm z-10">
                  {typeof prod.precio === 'number' ? `${prod.precio.toFixed(2)}€` : prod.precio}
                </span>
              </div>

              {/* Información del producto */}
              <div className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-[#2c2520] mb-2 font-sans tracking-widest uppercase group-hover:text-[#4a3319] transition-colors duration-300">
                  {prod.nombre}
                </h3>
                <p className="text-xs md:text-sm text-[#6e6359] font-serif italic leading-relaxed">
                  {prod.descripcion || 'Descripción del plato'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Destacados;