import 'react';
import imgSobreNosotros from '../assets/sobre-nosotros.jpg';

function SobreNosotros() {
    return (
        <section id="Sobre Nosotros" className="w-full bg-[#f3ede4] py-20 px-5 font-sans">
            {/* Contenedor principal optimizado en rejilla asimétrica */}
            <div className="w-full max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

                {/* Columna Izquierda: Composición de imágenes (Ocupa 5 de 12 columnas) */}
                <div className="md:col-span-5 relative flex justify-center animate-[fadeIn_0.6s_ease-out]">
                    {/* Marco decorativo de fondo */}
                    <div className="absolute -inset-4 border border-[#8c7662]/20 rounded-2xl transform translate-x-2 translate-y-2 pointer-events-none hidden sm:block"></div>

                    {/* Contenedor de la imagen principal */}
                    <div className="relative w-full aspect-[4/5] max-w-[380px] bg-gradient-to-b from-[#ebdccb] to-[#c3b7ac] rounded-xl overflow-hidden shadow-xl border border-[#e6dfd5]">
                        <img
                            src={imgSobreNosotros}
                            alt="Postres caseros en Koh Tao"
                            className="w-full h-full object-cover filter sepia-[0.15] hover:scale-103 transition-transform duration-700 ease-out"
                            onError={(e) => {
                                // Alternativa visual elegante si la imagen tarda en cargar o no existe aún
                                e.target.style.display = 'none';
                            }}
                        />
                        {/* Sello flotante de año de fundación */}
                        <div className="absolute bottom-6 right-6 bg-[#2c2520] text-white py-3 px-4 rounded-xl flex flex-col items-center shadow-md border border-white/10">
                            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] opacity-80">Desde</span>
                            <span className="text-sm font-bold tracking-widest mt-0.5">2026</span>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Bloque Narrativo (Ocupa 7 de 12 columnas) */}
                <div className="md:col-span-7 flex flex-col text-left md:pl-6">
                    <span className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-[#8c7662] block mb-2">
                        Conócenos más
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif italic text-[#2c2520] tracking-wide mb-4">
                        Nuestra Historia
                    </h2>
                    <div className="w-12 h-[1px] bg-[#8c7662]/40 mb-8"></div>

                    {/* Texto de la historia fiel a la cafetería, desayunos y meriendas */}
                    <div className="flex flex-col gap-5 text-sm md:text-base text-[#6e6359] font-serif italic leading-relaxed">
                        <p>
                            <span className="font-sans font-semibold text-[#2c2520] not-italic tracking-wider uppercase text-xs block mb-1">Nuestra Esencia</span>
                            KOH TAO nació con una idea muy clara: ser ese lugar de confianza al que vas a desconectar, charlar y disfrutar de un buen desayuno o una merienda sin prisas en el corazón de la ciudad.
                        </p>
                        <p>
                            Para nosotros, el secreto de una buena tarde o un desayuno perfecto está en el cariño de lo hecho en casa. Por eso, todos los postres y tartas que acompañan tus cafés están elaborados con las propias manos de nuestra dueña, recuperando el sabor de las recetas caseras y auténticas.
                        </p>
                        <p>
                            Nos encanta cuidar los pequeños detalles. Seleccionamos un café de especialidad excelente para que, junto a una porción de nuestras tartas del día, tus mañanas y tardes en la cafetería se conviertan en tu momento favorito del día.
                        </p>
                    </div>

                    {/* Pequeños destacados de valor de marca ajustados */}
                    <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-[#c3b7ac]/20">
                        <div>
                            <h4 className="text-xs font-semibold font-sans uppercase tracking-widest text-[#2c2520] mb-1">
                                ☕ Desayunos y Meriendas
                            </h4>
                            <p className="text-xs text-[#7d7065] font-serif italic">El rincón perfecto para pausar el día con buen café.</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold font-sans uppercase tracking-widest text-[#2c2520] mb-1">
                                🍰 Postres de la Dueña
                            </h4>
                            <p className="text-xs text-[#7d7065] font-serif italic">Recetas caseras hechas con alma para endulzar tu visita.</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default SobreNosotros;