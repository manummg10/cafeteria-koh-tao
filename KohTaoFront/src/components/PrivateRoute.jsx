import 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // <- Importación para solucionar SonarQube

function PrivateRoute({ children }) {
  // Simulamos la autenticación leyendo el almacenamiento local (localStorage)
  const isAuthenticated = localStorage.getItem('token_koh_tao') === 'true';

  // Si no está autenticado, lo mandamos directo a la raíz pública
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si está autenticado, le dejamos ver el panel interno
  return children;
}

// Validación de props para silenciar el aviso javascript:S677
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;