import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useApiResource } from '../../hooks/useApiResource';
import AdminSidebar from '../../components/admin/AdminSidebar';
import CartaSection from '../../components/admin/CartaSection';
import EspecialesSection from '../../components/admin/EspecialesSection';
import ReservasSection from '../../components/admin/reservas/ReservasSection';

function AdminDashboard() {
  const [seccionActiva, setSeccionActiva] = useState('carta');
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const reservas = useApiResource('/api/reservas');

  const handleLogout = async () => {
    await logout();
    navigate('/admin', { replace: true });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fdfbf7] font-sans antialiased text-[#2c2520]">
      <AdminSidebar
        seccionActiva={seccionActiva}
        onCambiar={setSeccionActiva}
        totalReservas={reservas.items.length}
        email={usuario?.email}
        onLogout={handleLogout}
      />

      <main className="flex-grow p-4 md:p-10 font-sans min-w-0 overflow-x-hidden">
        {seccionActiva === 'carta' && <CartaSection />}
        {seccionActiva === 'especiales' && <EspecialesSection />}
        {seccionActiva === 'reservas' && <ReservasSection recurso={reservas} />}
      </main>
    </div>
  );
}

export default AdminDashboard;
