import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RUTA_PANEL_DASHBOARD } from '../../config/rutas';

const MENSAJES_ERROR = {
  401: 'Correo o contraseña incorrectos.',
  423: 'Cuenta bloqueada temporalmente por intentos fallidos. Inténtalo más tarde.',
  429: 'Demasiados intentos. Espera un minuto antes de volver a probar.',
};

function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { usuario, login } = useAuth();
  const navigate = useNavigate();

  if (usuario) return <Navigate to={RUTA_PANEL_DASHBOARD} replace />;

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      // El backend responde con una cookie HttpOnly: el token nunca pasa por JS
      await login(credentials.email, credentials.password);
      navigate(RUTA_PANEL_DASHBOARD, { replace: true });
    } catch (err) {
      setError(MENSAJES_ERROR[err.response?.status] ?? 'No se pudo conectar con el servidor.');
      setCredentials(c => ({ ...c, password: '' }));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#1a1614] p-5 box-border font-sans">
      <div className="bg-white p-8 md:p-10 rounded-xl w-full max-w-md shadow-[0_10px_30px_rgba(0,0,0,0.4)] text-center border border-white/5">
        
        {/* Título y Subtítulo */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a1614] mb-1 font-serif uppercase tracking-tight">
          Koh Tao
        </h2>
        <p className="text-xs md:text-sm text-[#594636] font-extrabold mb-8 uppercase tracking-widest">
          Panel de Control Interno
        </p>
        
        {/* Formulario */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5 text-left">
          
          {/* Campo Correo */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email-field" className="text-xs font-bold text-[#382e27] uppercase tracking-wider">
              Correo electrónico
            </label>
            <input
              id="email-field"
              type="email"
              name="email"
              autoComplete="username"
              maxLength={254}
              value={credentials.email}
              onChange={handleChange}
              required
              placeholder="tu@correo.com"
              className="w-full p-3 rounded-lg border border-[#857464] text-base text-[#1a1614] placeholder-[#615347] focus:outline-none focus:border-[#1a1614] focus:ring-1 focus:ring-[#1a1614] transition-all box-border"
            />
          </div>
          
          {/* Campo Contraseña */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password-field" className="text-xs font-bold text-[#382e27] uppercase tracking-wider">
              Contraseña
            </label>
            <input 
              id="password-field"
              type="password" 
              name="password"
              autoComplete="current-password"
              maxLength={128}
              value={credentials.password}
              onChange={handleChange} 
              required 
              placeholder="••••••••"
              className="w-full p-3 rounded-lg border border-[#857464] text-base text-[#1a1614] placeholder-[#615347] focus:outline-none focus:border-[#1a1614] focus:ring-1 focus:ring-[#1a1614] transition-all box-border"
            />
          </div>
          
          {error && (
            <p role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-bold text-center">{error}</p>
          )}

          {/* Botón de Acceso */}
          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-[#594636] text-white p-3.5 mt-2 text-sm font-bold rounded-lg uppercase tracking-wider cursor-pointer hover:bg-[#1a1614] active:scale-[0.98] transition-all duration-200 shadow-sm disabled:opacity-60"
          >
            {enviando ? 'Comprobando...' : 'Acceder al Panel'}
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;