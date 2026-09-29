// Componentes de la web pública
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Destacados from './components/Destacados';
import MenuPreview from './components/MenuPreview';
import SobreNosotros from './components/SobreNosotros';
import Contacto from './components/Contacto';
import Footer from './components/Footer';

// Web de una sola página (sin panel interno: el contenido está en src/config/contenido.js)
function App() {
  return (
    // Estructura Flexbox para que el footer nunca flote a mitad de página
    <div className="flex flex-col min-h-screen bg-[#fdfbf7]">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <Destacados />
        <MenuPreview />
        <SobreNosotros />
        <Contacto />
      </main>
      <Footer />
    </div>
  );
}

export default App;
