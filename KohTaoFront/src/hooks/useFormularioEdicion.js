import { useCallback, useState } from 'react';

// Estado de un formulario de alta/edición: valores, id en edición y reinicio.
export function useFormularioEdicion(valoresIniciales) {
  const [valores, setValores] = useState(valoresIniciales);
  const [idEditar, setIdEditar] = useState(null);

  const cambiar = useCallback(campo => e => {
    const valor = e?.target ? e.target.value : e;
    setValores(v => ({ ...v, [campo]: valor }));
  }, []);

  const editar = useCallback((id, datos) => {
    setIdEditar(id);
    setValores({ ...valoresIniciales, ...datos });
  }, [valoresIniciales]);

  const reiniciar = useCallback(() => {
    setIdEditar(null);
    setValores(valoresIniciales);
  }, [valoresIniciales]);

  return { valores, cambiar, idEditar, editar, reiniciar };
}
