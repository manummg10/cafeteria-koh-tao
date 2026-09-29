import { useState } from 'react';
import PropTypes from 'prop-types';
import { KeyRound, Trash2, Copy } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useApiResource } from '../../hooks/useApiResource';
import { useMensajeTemporal } from '../../hooks/useMensajeTemporal';
import { generarPasswordTemporal } from '../../utils/password';
import { PanelCard, CampoFormulario, MensajeEstado, ListaItems, inputClase } from './ui/AdminUI';
import { mensajeDeError } from './ui/mensajeDeError';

const ENDPOINT = '/api/usuarios';
const nuevoFormulario = () => ({ email: '', rol: 'Propietario', passwordTemporal: generarPasswordTemporal() });

const formatearFecha = iso => (iso ? new Date(iso).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) : 'Nunca');

// Muestra una contraseña temporal UNA sola vez para que el desarrollador se la pase al usuario
function AvisoPasswordTemporal({ email, password, onCerrar }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <div role="alert" className="p-4 mb-6 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-sm">
      <p className="font-bold mb-2">Contraseña temporal para {email}</p>
      <div className="flex flex-wrap items-center gap-2">
        <code className="px-3 py-1.5 bg-white border border-amber-300 rounded font-mono text-base select-all">{password}</code>
        <button type="button" onClick={copiar} className="flex items-center gap-1 px-3 py-1.5 rounded bg-amber-600 text-white text-xs font-bold uppercase">
          <Copy size={14} /> {copiado ? 'Copiada' : 'Copiar'}
        </button>
        <button type="button" onClick={onCerrar} className="px-3 py-1.5 rounded bg-white border border-amber-300 text-xs font-bold uppercase">Hecho</button>
      </div>
      <p className="mt-2 text-xs">Pásasela por un canal privado. No se volverá a mostrar y tendrá que cambiarla al entrar.</p>
    </div>
  );
}

AvisoPasswordTemporal.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onCerrar: PropTypes.func.isRequired,
};

function UsuariosSection() {
  const { usuario: yo } = useAuth();
  const { items: usuarios, cargando, crear, eliminar, recargar } = useApiResource(ENDPOINT);
  const [form, setForm] = useState(nuevoFormulario);
  const [temporal, setTemporal] = useState(null);
  const [mensaje, mostrarMensaje] = useMensajeTemporal(5000);
  const cambiar = campo => e => setForm(f => ({ ...f, [campo]: e.target.value }));

  const handleCrear = async e => {
    e.preventDefault();
    try {
      await crear(form);
      setTemporal({ email: form.email, password: form.passwordTemporal });
      setForm(nuevoFormulario());
    } catch (error) {
      mostrarMensaje(`❌ ${mensajeDeError(error, 'No se pudo crear el usuario.')}`, 'error');
    }
  };

  const handleRestablecer = async u => {
    if (!window.confirm(`¿Restablecer la contraseña de ${u.email}? Se cerrarán sus sesiones abiertas.`)) return;
    const passwordTemporal = generarPasswordTemporal();
    try {
      await api.post(`${ENDPOINT}/${u.id}/restablecer-password`, { passwordTemporal });
      await recargar();
      setTemporal({ email: u.email, password: passwordTemporal });
    } catch (error) {
      mostrarMensaje(`❌ ${mensajeDeError(error, 'No se pudo restablecer la contraseña.')}`, 'error');
    }
  };

  const handleEliminar = async u => {
    if (!window.confirm(`¿Eliminar definitivamente la cuenta de ${u.email}?`)) return;
    try {
      await eliminar(u.id);
      mostrarMensaje('🗑️ Usuario eliminado.');
    } catch (error) {
      mostrarMensaje(`❌ ${mensajeDeError(error, 'No se pudo eliminar el usuario.')}`, 'error');
    }
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out]">
      <h2 className="text-2xl md:text-3xl font-bold text-[#4a3319] mb-6 font-serif">🔑 Usuarios del panel</h2>

      {temporal && <AvisoPasswordTemporal {...temporal} onCerrar={() => setTemporal(null)} />}
      <MensajeEstado mensaje={mensaje} className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <PanelCard className="lg:col-span-5" titulo="Crear cuenta">
          <form onSubmit={handleCrear} className="p-6 flex flex-col gap-4">
            <CampoFormulario label="Correo *" htmlFor="usuario-email">
              <input id="usuario-email" type="email" required maxLength={254} value={form.email} onChange={cambiar('email')} placeholder="dueno@cafeteria.com" className={inputClase} />
            </CampoFormulario>
            <CampoFormulario label="Perfil" htmlFor="usuario-rol">
              <select id="usuario-rol" value={form.rol} onChange={cambiar('rol')} className={`${inputClase} bg-white`}>
                <option value="Propietario">Propietario (carta, tartas y encargos)</option>
                <option value="Desarrollador">Desarrollador (acceso total)</option>
              </select>
            </CampoFormulario>
            <CampoFormulario label="Contraseña temporal" htmlFor="usuario-pwd">
              <div className="flex gap-2">
                <input id="usuario-pwd" type="text" readOnly value={form.passwordTemporal} className={`${inputClase} font-mono bg-gray-50`} />
                <button type="button" onClick={() => setForm(f => ({ ...f, passwordTemporal: generarPasswordTemporal() }))} className="px-3 rounded-lg bg-gray-100 text-xs font-bold uppercase">Otra</button>
              </div>
            </CampoFormulario>
            <button type="submit" className="p-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#4a3319] hover:bg-[#614424] text-white">Crear cuenta</button>
          </form>
        </PanelCard>

        <PanelCard className="lg:col-span-7" titulo={`Cuentas (${usuarios.length})`}>
          <ListaItems cargando={cargando}>
            {usuarios.map(u => (
              <div key={u.id} className="flex justify-between items-center gap-3 p-3.5 bg-[#fdfbf7] border border-[#e6dfd5] rounded-xl">
                <div className="overflow-hidden text-sm">
                  <strong className="block truncate text-[#4a3319]">{u.email}{u.email === yo?.email && ' (tú)'}</strong>
                  <span className="block text-xs text-gray-500">
                    {u.rol} · Último acceso: {formatearFecha(u.ultimoAccesoUtc)}
                    {u.debeCambiarPassword && ' · Pendiente de cambiar contraseña'}
                  </span>
                </div>
                {u.email !== yo?.email && (
                  <div className="flex gap-2 shrink-0">
                    <button type="button" onClick={() => handleRestablecer(u)} title="Restablecer contraseña" aria-label={`Restablecer contraseña de ${u.email}`} className="bg-amber-500 text-white p-2 rounded-md"><KeyRound size={14} /></button>
                    <button type="button" onClick={() => handleEliminar(u)} title="Eliminar" aria-label={`Eliminar ${u.email}`} className="bg-red-600 text-white p-2 rounded-md"><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
            ))}
          </ListaItems>
        </PanelCard>
      </div>
    </div>
  );
}

export default UsuariosSection;
