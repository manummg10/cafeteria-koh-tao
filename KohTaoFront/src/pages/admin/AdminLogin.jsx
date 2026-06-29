import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Guardamos el token de prueba
    localStorage.setItem('token_koh_tao', 'true');
    
    // Redirigimos al dashboard sin recargar
    navigate('/admin/dashboard');
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
          
          {/* Campo Usuario */}
          <div className="flex flex-col gap-2">
            <label htmlFor="username-field" className="text-xs font-bold text-[#382e27] uppercase tracking-wider">
              Usuario
            </label>
            <input 
              id="username-field"
              type="text" 
              name="username" 
              value={credentials.username} 
              onChange={handleChange} 
              required 
              placeholder="Introduce tu usuario"
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
              value={credentials.password} 
              onChange={handleChange} 
              required 
              placeholder="••••••••"
              className="w-full p-3 rounded-lg border border-[#857464] text-base text-[#1a1614] placeholder-[#615347] focus:outline-none focus:border-[#1a1614] focus:ring-1 focus:ring-[#1a1614] transition-all box-border"
            />
          </div>
          
          {/* Botón de Acceso */}
          <button 
            type="submit" 
            className="w-full bg-[#594636] text-white p-3.5 mt-2 text-sm font-bold rounded-lg uppercase tracking-wider cursor-pointer hover:bg-[#1a1614] active:scale-[0.98] transition-all duration-200 shadow-sm"
          >
            Acceder al Panel
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;