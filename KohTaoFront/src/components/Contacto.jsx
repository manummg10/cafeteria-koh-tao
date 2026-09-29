import { useState } from 'react';
import { NEGOCIO, mapaEmbedUrl, mapaComoLlegarUrl, telefonoHref } from '../config/negocio';

const FORMULARIO_VACIO = { nombre: '', email: '', mensaje: '' };

// Envío con Netlify Forms (sin servidor propio). El formulario "contacto" se declara también
// en index.html para que Netlify lo detecte al desplegar. "bot-field" es un honeypot anti-spam.
function Contacto() {
  const [formData, setFormData] = useState(FORMULARIO_VACIO);
  const [trampa, setTrampa] = useState('');
  const [estado, setEstado] = useState('inactivo'); // inactivo | enviando | ok | error

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado('enviando');
    try {
      const respuesta = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'contacto', 'bot-field': trampa, ...formData }).toString(),
      });
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      setFormData(FORMULARIO_VACIO);
      setEstado('ok');
    } catch {
      setEstado('error');
    }
  };

  return (
    <section id='Escríbenos' className="w-full bg-[#fdfbf7] py-20 px-5 font-sans">
      {/* Contenedor responsivo: 1 columna en móvil, 2 columnas desde pantallas md/lg */}
      <div className="w-full max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
        
        {/* Columna Izquierda: Formulario (Ocupa 7 de 12 columnas en escritorio) */}
        <div className="md:col-span-7 flex flex-col">
          <span className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-[#8c7662] block mb-2">
            ¿Tienes alguna duda?
          </span>
          <h2 className="text-3xl md:text-4xl font-serif italic text-[#2c2520] tracking-wide">
            Escríbenos
          </h2>
          <div className="w-12 h-[1px] bg-[#8c7662]/40 mt-4 mb-9"></div>
          
          <form name="contacto" onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Honeypot: invisible para personas; si un bot lo rellena, Netlify descarta el mensaje */}
            <p className="hidden" aria-hidden="true">
              <label>No rellenar: <input name="bot-field" tabIndex={-1} autoComplete="off" value={trampa} onChange={e => setTrampa(e.target.value)} /></label>
            </p>
            <div className="flex flex-col gap-2">
              <label htmlFor="nombre" className="text-xs font-semibold text-[#51443a] uppercase tracking-widest font-sans">
                Nombre
              </label>
              <input 
                type="text" 
                id="nombre" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                required 
                placeholder="Tu nombre"
                className="w-full p-3 border border-[#c3b7ac] bg-white rounded text-sm text-[#2c2520] font-sans placeholder-gray-400 focus:outline-none focus:border-[#2c2520] transition-colors duration-300"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-semibold text-[#51443a] uppercase tracking-widest font-sans">
                Correo Electrónico
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="tu@email.com"
                className="w-full p-3 border border-[#c3b7ac] bg-white rounded text-sm text-[#2c2520] font-sans placeholder-gray-400 focus:outline-none focus:border-[#2c2520] transition-colors duration-300"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="mensaje" className="text-xs font-semibold text-[#51443a] uppercase tracking-widest font-sans">
                Mensaje
              </label>
              <textarea 
                id="mensaje" 
                name="mensaje" 
                value={formData.mensaje} 
                onChange={handleChange} 
                required 
                rows="5" 
                placeholder="¿En qué podemos ayudarte?"
                className="w-full p-3 border border-[#c3b7ac] bg-white rounded text-sm text-[#2c2520] placeholder-gray-400 focus:outline-none focus:border-[#2c2520] transition-colors duration-300 resize-none font-sans"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={estado === 'enviando'}
              className="bg-[#2c2520] text-white py-3.5 px-8 text-xs font-semibold rounded uppercase tracking-widest font-sans transition-all duration-300 hover:bg-[#453931] hover:-translate-y-0.5 active:translate-y-0 self-start mt-2 shadow-sm cursor-pointer disabled:opacity-60"
            >
              {estado === 'enviando' ? 'Enviando...' : 'Enviar Mensaje'}
            </button>

            {estado === 'ok' && (
              <p role="status" className="text-sm font-serif italic text-green-800">¡Gracias! Hemos recibido tu mensaje y te responderemos pronto.</p>
            )}
            {estado === 'error' && (
              <p role="alert" className="text-sm font-serif italic text-red-700">No se pudo enviar el mensaje. Inténtalo de nuevo en unos minutos.</p>
            )}
          </form>
        </div>

        {/* Columna Derecha: Info y Mapa (Ocupa 5 de 12 columnas en escritorio) */}
        <div className="md:col-span-5 flex flex-col gap-9 justify-center h-full">
          <div className="flex flex-col">
            <h3 className="text-xs font-semibold text-[#2c2520] mb-3 font-sans tracking-widest uppercase border-b border-[#c3b7ac]/30 pb-1.5 w-fit">
              Visítanos
            </h3>
            <p className="text-sm md:text-base text-[#6e6359] font-serif italic leading-relaxed">{NEGOCIO.direccion.calle}</p>
            <p className="text-sm md:text-base text-[#6e6359] font-serif italic leading-relaxed">{NEGOCIO.direccion.cpCiudad}</p>
            {NEGOCIO.telefono && (
              <a href={telefonoHref} className="text-sm md:text-base text-[#6e6359] font-serif italic leading-relaxed hover:text-[#4a3319] w-fit">{NEGOCIO.telefono}</a>
            )}
          </div>

          <div className="flex flex-col">
            <h3 className="text-xs font-semibold text-[#2c2520] mb-3 font-sans tracking-widest uppercase border-b border-[#c3b7ac]/30 pb-1.5 w-fit">
              Nuestro Horario
            </h3>
            {NEGOCIO.horario.map(({ dias, horas }) => (
              <p key={dias} className="text-sm md:text-base text-[#6e6359] font-serif italic leading-relaxed mb-1">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#2c2520] not-italic mr-1">{dias}:</span> {horas}
              </p>
            ))}
          </div>

          {/* 🗺️ Mapa de Google (embebido, sin API key) */}
          <div className="flex flex-col gap-2 md:flex-grow">
            <div className="w-full h-64 md:h-auto md:flex-grow min-h-[250px] bg-[#ede6de] border border-[#c3b7ac]/60 rounded-xl overflow-hidden shadow-inner">
              <iframe
                title={`Mapa de ${NEGOCIO.nombre}`}
                src={mapaEmbedUrl}
                className="w-full h-full min-h-[250px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a href={mapaComoLlegarUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold uppercase tracking-widest text-[#4a3319] hover:text-[#d4b285] w-fit">
              📍 Cómo llegar
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Contacto;