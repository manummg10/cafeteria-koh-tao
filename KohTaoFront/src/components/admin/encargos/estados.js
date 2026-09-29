// Estados de un encargo (mismos valores que valida el backend)
export const ESTADOS = [
  { id: 'Pendiente', clase: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'Confirmado', clase: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'Listo', clase: 'bg-green-100 text-green-800 border-green-300' },
  { id: 'Entregado', clase: 'bg-gray-100 text-gray-600 border-gray-300' },
  { id: 'Cancelado', clase: 'bg-red-100 text-red-700 border-red-300' },
];

export const ESTADOS_ACTIVOS = ['Pendiente', 'Confirmado', 'Listo'];

export const claseEstado = estado => ESTADOS.find(e => e.id === estado)?.clase ?? '';

export const FILTROS = [
  { id: 'activos', etiqueta: 'Activos', coincide: e => ESTADOS_ACTIVOS.includes(e.estado) },
  ...ESTADOS.map(({ id }) => ({ id, etiqueta: id, coincide: e => e.estado === id })),
  { id: 'todos', etiqueta: 'Todos', coincide: () => true },
];

export const euros = n => `${Number(n).toFixed(2)}€`;
