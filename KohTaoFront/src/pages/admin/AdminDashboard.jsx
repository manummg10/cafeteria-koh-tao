import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Image, ClipboardList, UserCog, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { RUTA_PANEL } from '../../config/rutas';
import { useApiResource } from '../../hooks/useApiResource';
import AdminSidebar from '../../components/admin/AdminSidebar';
import CartaSection from '../../components/admin/CartaSection';
import EspecialesSection from '../../components/admin/EspecialesSection';
import EncargosSection from '../../components/admin/encargos/EncargosSection';
import { ESTADOS_ACTIVOS } from '../../components/admin/encargos/estados';
import MiCuentaSection from '../../components/admin/MiCuentaSection';
import UsuariosSection from '../../components/admin/UsuariosSection';

const TODOS = ['Propietario', 'Desarrollador'];

// Secciones del panel y qué perfiles pueden verlas (el backend aplica los mismos permisos)
const SECCIONES = [
  { id: 'carta', etiqueta: 'Gestionar Carta', Icono: LayoutGrid, roles: TODOS },
  { id: 'especiales', etiqueta: 'Especiales del Día', Icono: Image, roles: TODOS },
  { id: 'encargos', etiqueta: 'Encargos', Icono: ClipboardList, roles: TODOS },
  { id: 'usuarios', etiqueta: 'Usuarios', Icono: Users, roles: ['Desarrollador'] },
  { id: 'cuenta', etiqueta: 'Mi cuenta', Icono: UserCog, roles: TODOS },
];

function AdminDashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const encargos = useApiResource('/api/encargos');
  const encargosActivos = encargos.items.filter(e => ESTADOS_ACTIVOS.includes(e.estado)).length;
  const [seccionElegida, setSeccionElegida] = useState('carta');

  // Con contraseña temporal solo se puede acceder a "Mi cuenta" para cambiarla
  const visibles = usuario?.debeCambiarPassword
    ? SECCIONES.filter(s => s.id === 'cuenta')
    : SECCIONES.filter(s => s.roles.includes(usuario?.rol));
  const seccionActiva = visibles.some(s => s.id === seccionElegida) ? seccionElegida : visibles[0]?.id;

  const handleLogout = async () => {
    await logout();
    navigate(RUTA_PANEL, { replace: true });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fdfbf7] font-sans antialiased text-[#2c2520]">
      <AdminSidebar
        secciones={visibles.map(s => (s.id === 'encargos' ? { ...s, contador: encargosActivos } : s))}
        seccionActiva={seccionActiva}
        onCambiar={setSeccionElegida}
        email={usuario?.email}
        rol={usuario?.rol}
        onLogout={handleLogout}
      />

      <main className="flex-grow p-4 md:p-10 font-sans min-w-0 overflow-x-hidden">
        {seccionActiva === 'carta' && <CartaSection />}
        {seccionActiva === 'especiales' && <EspecialesSection />}
        {seccionActiva === 'encargos' && <EncargosSection recurso={encargos} />}
        {seccionActiva === 'usuarios' && <UsuariosSection />}
        {seccionActiva === 'cuenta' && <MiCuentaSection />}
      </main>
    </div>
  );
}

export default AdminDashboard;
