import { useCallback, useEffect, useRef, useState } from 'react';

// Mensaje de estado ({ texto, tipo: 'ok' | 'error' }) que se oculta solo tras `ms` milisegundos.
export function useMensajeTemporal(ms = 3000) {
  const [mensaje, setMensaje] = useState(null);
  const timer = useRef(null);

  const mostrar = useCallback((texto, tipo = 'ok') => {
    clearTimeout(timer.current);
    setMensaje({ texto, tipo });
    timer.current = setTimeout(() => setMensaje(null), ms);
  }, [ms]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return [mensaje, mostrar];
}
