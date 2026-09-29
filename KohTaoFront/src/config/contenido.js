// ✏️ Contenido de la web (sin panel: se edita aquí y se publica con git push).
// ⚠️ PENDIENTE: son EJEMPLOS neutros hasta que la dueña facilite la carta, precios y fotos reales.
// Fotos: guardarlas en /public/images/ (webp o jpg, ~800 px) y poner la ruta, p. ej. '/images/tarta-queso.webp'.
// precio: número en euros, o null para no mostrarlo.

export const ESPECIALES = [
  {
    id: 'tarta-queso',
    nombre: 'Tarta de queso',
    descripcion: 'Cremosa y horneada, con base de galleta.',
    precio: 4.5,
    imagen: null,
  },
  {
    id: 'carrot-cake',
    nombre: 'Carrot cake',
    descripcion: 'Bizcocho de zanahoria y nueces con frosting de queso.',
    precio: 4.5,
    imagen: null,
  },
  {
    id: 'tres-chocolates',
    nombre: 'Tarta de tres chocolates',
    descripcion: 'Capas suaves de chocolate negro, con leche y blanco.',
    precio: 4.5,
    imagen: null,
  },
];

export const CATEGORIAS_CARTA = [
  { id: 'cafes', etiqueta: 'Cafés', emoji: '☕' },
  { id: 'dulces', etiqueta: 'Tartas', emoji: '🍰' },
  { id: 'salado', etiqueta: 'Salado', emoji: '🥪' },
];

export const CARTA = [
  { id: 'espresso', categoria: 'cafes', nombre: 'Espresso', descripcion: null, precio: 1.3 },
  { id: 'cortado', categoria: 'cafes', nombre: 'Cortado', descripcion: null, precio: 1.4 },
  { id: 'cafe-con-leche', categoria: 'cafes', nombre: 'Café con leche', descripcion: null, precio: 1.6 },
  { id: 'capuchino', categoria: 'cafes', nombre: 'Capuchino', descripcion: 'Con espuma de leche y cacao.', precio: 2.2 },
  { id: 'flat-white', categoria: 'cafes', nombre: 'Flat white', descripcion: 'Doble espresso con leche texturizada.', precio: 2.6 },

  { id: 'porcion-tarta', categoria: 'dulces', nombre: 'Porción de tarta del día', descripcion: 'Pregunta por las tentaciones de hoy.', precio: 4.5 },
  { id: 'croissant', categoria: 'dulces', nombre: 'Croissant de mantequilla', descripcion: null, precio: 1.8 },
  { id: 'tostada-dulce', categoria: 'dulces', nombre: 'Tostada con mantequilla y mermelada', descripcion: null, precio: 2 },

  { id: 'tostada-tomate', categoria: 'salado', nombre: 'Tostada con tomate y aceite', descripcion: 'Pan de pueblo, tomate rallado y AOVE.', precio: 2.5 },
  { id: 'mixto', categoria: 'salado', nombre: 'Sándwich mixto', descripcion: 'Jamón cocido y queso.', precio: 3.5 },
];
