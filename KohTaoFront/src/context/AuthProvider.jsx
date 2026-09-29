import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import { authService } from '../services/authService';
import { AuthContext } from './authContext';

// La sesión vive en una cookie HttpOnly; aquí solo guardamos quién es el usuario (email/rol).
function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    authService.me()
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false));

    // Si la sesión caduca mientras se usa el panel, cualquier 401 cierra la sesión local
    const interceptor = api.interceptors.response.use(
      r => r,
      error => {
        const url = error.config?.url ?? '';
        if (error.response?.status === 401 && !url.includes('/api/auth/')) setUsuario(null);
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  const login = useCallback(async (email, password) => {
    const u = await authService.login(email, password);
    setUsuario(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUsuario(null);
    }
  }, []);

  const valor = useMemo(() => ({ usuario, cargando, login, logout }), [usuario, cargando, login, logout]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
