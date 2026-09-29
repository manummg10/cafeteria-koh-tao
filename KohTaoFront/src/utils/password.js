export const PASSWORD_MIN = 12;

// Contraseña temporal aleatoria (criptográficamente segura), sin caracteres ambiguos
export function generarPasswordTemporal(longitud = 16) {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const valores = crypto.getRandomValues(new Uint32Array(longitud));
  return Array.from(valores, v => alfabeto[v % alfabeto.length]).join('');
}
