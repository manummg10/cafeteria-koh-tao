import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CakeSlice, Menu, ShieldAlert } from 'lucide-react';

// Única lista de secciones para el menú de escritorio y el móvil
const SECCIONES = [
  { id: 'inicio', etiqueta: 'Inicio' },
  { id: 'Tentaciones del día', etiqueta: 'Tentaciones del día' },
  { id: 'Nuestra Carta', etiqueta: 'Nuestra Carta' },
  { id: 'Sobre Nosotros', etiqueta: 'Sobre Nosotros' },
  { id: 'Escríbenos', etiqueta: 'Escríbenos' },
];

const DURACION_MENU_MS = 300; // debe coincidir con duration-300 del menú móvil

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();

  // Scroll suave descontando la barra fija. En móvil esperamos a que el menú se pliegue:
  // si no, la altura del nav cambia durante el scroll y se acaba a mitad de sección.
  const irASeccion = (id) => {
    const esperar = isOpen ? DURACION_MENU_MS + 20 : 0;
    setIsOpen(false);
    setTimeout(() => {
      const elemento = document.getElementById(id);
      if (!elemento) return;
      const alturaNav = navRef.current?.offsetHeight ?? 0;
      const destino = elemento.getBoundingClientRect().top + window.scrollY - alturaNav;
      window.scrollTo({ top: Math.max(destino, 0), behavior: 'smooth' });
    }, esperar);
  };

  return (
    <nav ref={navRef} className="bg-white border-b border-[#e6dfd5] sticky top-0 z-50 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ☕ LOGO REAL */}
        <button type="button" aria-label="Ir al inicio" className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-102" onClick={() => irASeccion('inicio')}>
          <img
            src="/favicon-192.png"
            alt="Logo Koh Tao"
            className="h-14 md:h-15 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </button>

        {/* 🖥️ NAVEGACIÓN SUAVE (ESCRITORIO) */}
        <ul className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest text-[#4a3319] uppercase">
          {SECCIONES.map(({ id, etiqueta }) => (
            <li key={id}>
              <button type="button" onClick={() => irASeccion(id)} className="hover:text-[#d4b285] transition-colors cursor-pointer">
                {etiqueta}
              </button>
            </li>
          ))}
        </ul>

        {/* 🔐 BOTÓN ADMIN (ESCRITORIO) */}
        <div className="hidden md:block">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1.5 border border-[#4a3319] text-[#4a3319] px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-widest hover:bg-[#4a3319] hover:text-white active:scale-95 transition-all cursor-pointer"
          >
            <ShieldAlert size={14} />
            Admin
          </button>
        </div>

        {/* 🍰 BOTÓN MENÚ MÓVIL (DE RAYAS A PORCIÓN DE TARTA) */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setIsOpen(abierto => !abierto)}
            className="text-[#4a3319] p-2 rounded-lg hover:bg-[#fdfbf7] active:scale-95 transition-all focus:outline-none flex items-center justify-center w-10 h-10"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <CakeSlice size={26} className="text-[#4a3319] hover:text-[#d4b285] animate-[spin_0.2s_ease-out] transition-colors" />
            ) : (
              <Menu size={26} className="text-[#4a3319] hover:text-[#d4b285]" />
            )}
          </button>
        </div>

      </div>

      {/* 📱 MENÚ DESPLEGABLE (MÓVIL) */}
      <div className={`md:hidden bg-white border-t border-[#e6dfd5] shadow-inner transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <ul className="flex flex-col text-xs font-semibold tracking-wider text-[#4a3319] uppercase p-4 gap-2">
          {SECCIONES.map(({ id, etiqueta }) => (
            <li key={id}>
              <button type="button" onClick={() => irASeccion(id)} className="w-full text-left p-2.5 rounded-lg hover:bg-[#fdfbf7] hover:text-[#d4b285] transition-colors">
                {etiqueta}
              </button>
            </li>
          ))}
          {/* Separador e item de Admin en móvil */}
          <li className="border-t border-gray-100 pt-2 mt-1">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#594636] text-white hover:bg-[#4a3319] transition-colors text-[11px] font-semibold uppercase tracking-widest"
            >
              <ShieldAlert size={14} />
              Acceso Admin
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
