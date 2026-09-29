// 🗺️ Distribución real de Koh Tao (27 espacios)
export const ZONAS = [
  { id: 'Terraseta Exterior', titulo: '🌿 Terraseta Exterior', unidad: 'Mesas' },
  { id: 'Salón Central', titulo: '☕ Salón Interior', unidad: 'Mesas' },
  { id: 'Zona Barra Alta', titulo: '🥂 Taburetes de Barra Alta', unidad: 'Espacios' },
];

export const MESAS = [
  ...Array.from({ length: 8 }, (_, i) => ({ numero: i + 1, capacidad: 4, zona: 'Terraseta Exterior' })),
  ...Array.from({ length: 11 }, (_, i) => ({ numero: i + 9, capacidad: [2, 4, 6][i % 3], zona: 'Salón Central' })),
  ...Array.from({ length: 8 }, (_, i) => ({ numero: i + 20, capacidad: 1, zona: 'Zona Barra Alta' })),
];

export function formatearFecha(fechaString) {
  const fecha = new Date(fechaString);
  if (Number.isNaN(fecha.getTime())) return fechaString;
  const dos = n => n.toString().padStart(2, '0');
  return `${dos(fecha.getDate())}/${dos(fecha.getMonth() + 1)}/${fecha.getFullYear()} ${dos(fecha.getHours())}:${dos(fecha.getMinutes())}`;
}

// Valor por defecto para <input type="datetime-local"> (hora local actual)
export function ahoraLocalISO() {
  const ahora = new Date();
  ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
  return ahora.toISOString().slice(0, 16);
}
