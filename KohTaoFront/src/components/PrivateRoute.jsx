import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';
import { RUTA_PANEL } from '../config/rutas';

// Solo controla la navegación: la protección real la hace el backend en cada endpoint.
function PrivateRoute({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return <p className="min-h-screen flex items-center justify-center text-sm text-gray-500 italic">Comprobando sesión...</p>;
  }

  if (!usuario) {
    return <Navigate to={RUTA_PANEL} replace />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
