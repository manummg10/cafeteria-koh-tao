const dos = n => n.toString().padStart(2, '0');

export function formatearFecha(fechaString) {
  const fecha = new Date(fechaString);
  if (Number.isNaN(fecha.getTime())) return fechaString;
  return `${dos(fecha.getDate())}/${dos(fecha.getMonth() + 1)}/${fecha.getFullYear()} ${dos(fecha.getHours())}:${dos(fecha.getMinutes())}`;
}

// Valor para <input type="datetime-local"> (hora local). Sin argumento: ahora mismo.
export function aInputFechaHora(fecha = new Date()) {
  const d = new Date(fecha);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}
