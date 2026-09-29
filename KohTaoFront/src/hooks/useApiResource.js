import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';

// Hook reutilizable para listar y (opcionalmente) mutar un recurso REST: /api/productos, /api/encargos...
export function useApiResource(endpoint) {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    api.get(endpoint)
      .then(r => { if (activo) { setItems(r.data); setError(null); } })
      .catch(e => { if (activo) setError(e); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [endpoint]);

  const recargar = useCallback(
    () => api.get(endpoint).then(r => { setItems(r.data); setError(null); }),
    [endpoint]
  );

  const crear = useCallback(dto => api.post(endpoint, dto).then(recargar), [endpoint, recargar]);
  const actualizar = useCallback((id, dto) => api.put(`${endpoint}/${id}`, dto).then(recargar), [endpoint, recargar]);
  const eliminar = useCallback(id => api.delete(`${endpoint}/${id}`).then(recargar), [endpoint, recargar]);

  return { items, cargando, error, recargar, crear, actualizar, eliminar };
}
