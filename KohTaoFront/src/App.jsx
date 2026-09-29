import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import { RUTA_PANEL, RUTA_PANEL_DASHBOARD } from './config/rutas';

// Importamos los componentes de la Landing pública
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Destacados from './components/Destacados';
import MenuPreview from './components/MenuPreview';
import SobreNosotros from './components/SobreNosotros';
import Contacto from './components/Contacto';
import Footer from './components/Footer'; 

// Importamos las vistas de Administración y su Guardia de Seguridad
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';

// Agrupamos la vista pública comercial
function PublicLanding() {
  return (
    // Estructura Flexbox para que el footer nunca flote a mitad de página
    <div className="flex flex-col min-h-screen bg-[#fdfbf7]">
      <Navbar/>
      {/* Contenido principal de la web */}
      <main className="flex-grow">
        <HeroSection />
        <Destacados />
        <MenuPreview />
        <SobreNosotros />
        <Contacto />
      </main>
      
      {/* 2. El Footer se renderiza solo aquí, al final de la landing pública */}
      <Footer />
    </div>
  );
}

// ÚNICA DECLARACIÓN DE APP
function App() {
  return (
    <Routes>
      {/* Ruta principal: Muestra la cafetería Koh Tao al público */}
      <Route path="/" element={<PublicLanding />} />
      
      {/* Zona interna (sin enlaces desde la web): la sesión solo se consulta aquí */}
      <Route element={<AuthProvider><Outlet /></AuthProvider>}>
        {/* Login del panel (Limpio, sin footer) */}
        <Route path={RUTA_PANEL} element={<AdminLogin />} />

        {/* 🔒 Panel de gestión: el backend valida la cookie en cada petición */}
        <Route
          path={RUTA_PANEL_DASHBOARD}
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Cualquier otra ruta (incluida /admin) vuelve a la web pública */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;