import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMensajeTemporal } from '../../hooks/useMensajeTemporal';
import { PASSWORD_MIN } from '../../utils/password';
import { PanelCard, CampoFormulario, MensajeEstado, inputClase } from './ui/AdminUI';
import { mensajeDeError } from './ui/mensajeDeError';

const ETIQUETA_ROL = { Desarrollador: 'Desarrollador (acceso total)', Propietario: 'Propietario' };
const VACIO = { actual: '', nueva: '', repetir: '' };

function MiCuentaSection() {
  const { usuario, cambiarPassword } = useAuth();
  const [form, setForm] = useState(VACIO);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, mostrarMensaje] = useMensajeTemporal(5000);
  const cambiar = campo => e => setForm(f => ({ ...f, [campo]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.nueva.length < PASSWORD_MIN) return mostrarMensaje(`❌ La nueva contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`, 'error');
    if (form.nueva !== form.repetir) return mostrarMensaje('❌ Las contraseñas nuevas no coinciden.', 'error');

    setEnviando(true);
    try {
      await cambiarPassword(form.actual, form.nueva);
      setForm(VACIO);
      mostrarMensaje('✅ Contraseña cambiada. Las demás sesiones se han cerrado.');
    } catch (error) {
      mostrarMensaje(`❌ ${mensajeDeError(error, 'No se pudo cambiar la contraseña.')}`, 'error');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out] max-w-xl">
      <h2 className="text-2xl md:text-3xl font-bold text-[#4a3319] mb-6 font-serif">👤 Mi cuenta</h2>

      {usuario?.debeCambiarPassword && (
        <p role="alert" className="p-4 mb-6 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-sm font-semibold">
          Estás usando una contraseña temporal. Elige una contraseña nueva para poder usar el panel.
        </p>
      )}

      <PanelCard titulo="Datos de la cuenta" className="mb-6">
        <dl className="p-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="font-bold text-[#4a3319]">Correo</dt><dd className="truncate">{usuario?.email}</dd>
          <dt className="font-bold text-[#4a3319]">Perfil</dt><dd>{ETIQUETA_ROL[usuario?.rol] ?? usuario?.rol}</dd>
        </dl>
      </PanelCard>

      <PanelCard titulo="Cambiar contraseña">
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <CampoFormulario label="Contraseña actual *" htmlFor="pwd-actual">
            <input id="pwd-actual" type="password" autoComplete="current-password" required maxLength={128} value={form.actual} onChange={cambiar('actual')} className={inputClase} />
          </CampoFormulario>
          <CampoFormulario label={`Nueva contraseña * (mín. ${PASSWORD_MIN} caracteres)`} htmlFor="pwd-nueva">
            <input id="pwd-nueva" type="password" autoComplete="new-password" required minLength={PASSWORD_MIN} maxLength={128} value={form.nueva} onChange={cambiar('nueva')} className={inputClase} />
          </CampoFormulario>
          <CampoFormulario label="Repite la nueva contraseña *" htmlFor="pwd-repetir">
            <input id="pwd-repetir" type="password" autoComplete="new-password" required maxLength={128} value={form.repetir} onChange={cambiar('repetir')} className={inputClase} />
          </CampoFormulario>
          <button type="submit" disabled={enviando} className="p-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#4a3319] hover:bg-[#614424] text-white disabled:opacity-60">
            {enviando ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
          <MensajeEstado mensaje={mensaje} />
        </form>
      </PanelCard>
    </div>
  );
}

export default MiCuentaSection;
