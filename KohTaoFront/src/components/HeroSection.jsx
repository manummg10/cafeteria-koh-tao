import 'react';

function HeroSection() {
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section 
      id="inicio" // 🧭 ID añadido para la navegación desde la barra
      className="relative w-full h-screen flex justify-center items-center text-center px-5 overflow-hidden font-sans"
    >
      {/* 🎥 VÍDEO DE FONDO EN SUSTITUCIÓN DE LA IMAGEN */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/hero-cafeteria.mp4" type="video/mp4" />
        {/* Enlace de streaming por si quieres comprobarlo ya mismo antes de descargar el vídeo: */}
        <source src="https://assets.mixkit.co/videos/preview/mixkit-coffee-being-poured-into-a-cup-34441-large.mp4" type="video/mp4" />
      </video>

      {/* Capa oscura superpuesta (Overlay) */}
      <div className="absolute inset-0 bg-[#2c2520]/45 z-10"></div>
      
      {/* Contenido Central */}
      <div className="relative z-20 text-white max-w-4xl flex flex-col items-center">
        
        {/* ☕ LOGO CON PROPORCIÓN IGUALADA EN MÓVIL Y WEB */}
        <div className="w-31 h-31 md:w-60 md:h-60 rounded-full bg-white p-5 md:p-10 shadow-xl flex items-center justify-center mb-6 animate-[fadeIn_0.5s_ease-out]">
          <img 
            src="/logo.png" 
            alt="Logo Koh Tao" 
            className="w-full h-full object-contain translate-x-2" 
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        
        {/* Subtítulo responsive (Calidez de la cafetería) */}
        <p className="text-xl md:text-2xl lg:text-3xl font-serif italic mb-9 drop-shadow-[1px_1px_5px_rgba(0,0,0,0.5)] tracking-wide">
          Desayunos y Meriendas
        </p>
        
        {/* Botón con efectos (Fuerza e impacto corporativo) */}
        <button 
          className="bg-white text-[#2c2520] border-none py-3.5 px-8 text-xs font-semibold rounded uppercase tracking-widest font-sans transition-all duration-300 hover:bg-[#2c2520] hover:text-white hover:-translate-y-1 shadow-md cursor-pointer"
          onClick={handleScroll}
        >
          Descubrir la experiencia
        </button>
      </div>
      
      {/* 🧭 Indicador de scroll animado */}
      <div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-3xl cursor-pointer animate-bounce z-20"
        onClick={handleScroll}
      >
        ↓
      </div>
    </section>
  );
}

export default HeroSection;