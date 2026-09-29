// 4.5 -> "4,50 €"
export const formatearPrecio = precio =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(precio);
