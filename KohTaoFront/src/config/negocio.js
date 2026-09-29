// 📇 Datos reales de la cafetería: ÚNICA fuente para Contacto, Footer y mapa.
// ⚠️ PENDIENTE: sustituir por los datos reales confirmados por el propietario.
export const NEGOCIO = {
  nombre: 'Koh Tao Café',
  direccion: {
    calle: 'Calle de la Dulzura, Nº 14',
    cpCiudad: '25002 Lleida',
  },
  telefono: '+34 973 00 00 00',
  horario: [
    { dias: 'Lunes a Viernes', horas: '8:00h - 13:00h | 16:30h - 20:30h' },
    { dias: 'Sábados y Domingos', horas: '9:00h - 14:00h | 17:00h - 21:00h' },
  ],
  redes: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
};

export const direccionCompleta = `${NEGOCIO.direccion.calle}, ${NEGOCIO.direccion.cpCiudad}`;

// Google Maps embebido sin API key (búsqueda por dirección)
export const mapaEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${NEGOCIO.nombre}, ${direccionCompleta}`)}&output=embed`;
export const mapaComoLlegarUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(direccionCompleta)}`;
export const telefonoHref = `tel:${NEGOCIO.telefono.replace(/\s/g, '')}`;
