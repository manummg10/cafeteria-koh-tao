// Extrae el mensaje de error de la API (ProblemDetails o { mensaje }) sin exponer detalles técnicos
export function mensajeDeError(error, porDefecto) {
  const data = error?.response?.data;
  if (data?.mensaje) return data.mensaje;
  if (data?.errors) return Object.values(data.errors).flat()[0] ?? porDefecto;
  return porDefecto;
}
