import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CakeSlice, Menu, ShieldAlert } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Función para hacer scroll suave a las secciones de la landing
  const handleScroll = (id) => {
    setIsOpen(false); // Cierra el menú móvil si estuviera abierto
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="bg-white border-b border-[#e6dfd5] sticky top-0 z-50 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ☕ LOGO REAL */}
        <div className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-102" onClick={() => handleScroll('inicio')}>
          <img
            src="/logo.png"
            alt="Logo Koh Tao"
            className="h-14 md:h-15 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* 🖥️ NAVEGACIÓN SUAVE (ESCRITORIO) */}
        <ul className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest text-[#4a3319] uppercase">
          <li>
            <button onClick={() => handleScroll('inicio')} className="hover:text-[#d4b285] transition-colors cursor-pointer">
              Inicio
            </button>
          </li>
          <li>
            <button onClick={() => handleScroll('Tentaciones del día')} className="hover:text-[#d4b285] transition-colors cursor-pointer">
              Tentaciones del día
            </button>
          </li>
          <li>
            <button onClick={() => handleScroll('Nuestra Carta')} className="hover:text-[#d4b285] transition-colors cursor-pointer">
              Nuestra Carta
            </button>
          </li>
          <li>
            <button onClick={() => handleScroll('Sobre Nosotros')} className="hover:text-[#d4b285] transition-colors cursor-pointer">
              Sobre Nosotros
            </button>
          </li>
          <li>
            <button onClick={() => handleScroll('Escríbenos')} className="hover:text-[#d4b285] transition-colors cursor-pointer">
              Escríbenos
            </button>
          </li>
        </ul>

        {/* 🔐 BOTÓN ADMIN (ESCRITORIO) */}
        <div className="hidden md:block">
          <button
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
            onClick={toggleMenu}
            className="text-[#4a3319] p-2 rounded-lg hover:bg-[#fdfbf7] active:scale-95 transition-all focus:outline-none flex items-center justify-center w-10 h-10"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? (
              <CakeSlice
                size={26}
                className="text-[#4a3319] hover:text-[#d4b285] animate-[spin_0.2s_ease-out] transition-colors"
              />
            ) : (
              <Menu
                size={26}
                className="text-[#4a3319] hover:text-[#d4b285]"
              />
            )}
          </button>
        </div>

      </div>

      {/* 📱 MENÚ DESPLEGABLE (MÓVIL) */}
      <div className={`md:hidden bg-white border-t border-[#e6dfd5] shadow-inner transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}>
        <ul className="flex flex-col text-xs font-semibold tracking-wider text-[#4a3319] uppercase p-4 gap-2">
          <li>
            <button onClick={() => handleScroll('inicio')} className="w-full text-left p-2.5 rounded-lg hover:bg-[#fdfbf7] hover:text-[#d4b285] transition-colors">
              Inicio
            </button>
          </li>
          <li>
            <button onClick={() => handleScroll('Tentaciones del día')} className="w-full text-left p-2.5 rounded-lg hover:bg-[#fdfbf7] hover:text-[#d4b285] transition-colors">
              Tentaciones del día
            </button>
          </li>
          <li>
            <button onClick={() => handleScroll('Nuestra Carta')} className="w-full text-left p-2.5 rounded-lg hover:bg-[#fdfbf7] hover:text-[#d4b285] transition-colors">
              Nuestra Carta
            </button>
          </li>
          <li>
            <button onClick={() => handleScroll('Sobre Nosotros')} className="w-full text-left p-2.5 rounded-lg hover:bg-[#fdfbf7] hover:text-[#d4b285] transition-colors">
              Sobre Nosotros
            </button>
          </li>
          <li>
            <button onClick={() => handleScroll('Escríbenos')} className="w-full text-left p-2.5 rounded-lg hover:bg-[#fdfbf7] hover:text-[#d4b285] transition-colors">
              Escríbenos
            </button>
          </li>
          {/* Separador e item de Admin en móvil */}
          <li className="border-t border-gray-100 pt-2 mt-1">
            <button
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