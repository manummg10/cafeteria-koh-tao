// 📇 Datos reales de la cafetería: ÚNICA fuente para Contacto, Footer, mapa y SEO (index.html, sitemap).
// ⚠️ PENDIENTE: teléfono, horario y perfiles reales de redes (la dirección ya es la real).
export const NEGOCIO = {
  nombre: 'Koh Tao Café',
  sitioUrl: 'https://cafeteriakohtao.netlify.app', // cambiar aquí si se compra dominio propio
  direccion: {
    calle: 'C/ Océano Atlántico, 15',
    codigoPostal: '04700',
    localidad: 'El Ejido',
    provincia: 'Almería',
    pais: 'ES',
  },
  telefono: null, // p. ej. '+34 950 00 00 00' (null = no se muestra)
  horario: [
    { dias: 'Lunes a Viernes', horas: '8:00h - 13:00h | 16:30h - 20:30h' },
    { dias: 'Sábados y Domingos', horas: '9:00h - 14:00h | 17:00h - 21:00h' },
  ],
  redes: {
    instagram: 'https://www.instagram.com', // TODO: URL del perfil real cuando exista
    facebook: 'https://www.facebook.com', // TODO: URL de la página real cuando exista
  },
};

// Textos para buscadores y para la vista previa al compartir (WhatsApp, redes)
export const SEO = {
  titulo: 'Koh Tao Café | Cafetería en El Ejido, Almería · Desayunos y meriendas',
  descripcion:
    'Koh Tao Café, cafetería en El Ejido (Almería): cafés de especialidad, tartas artesanales, desayunos y meriendas. Te esperamos en C/ Océano Atlántico, 15.',
  imagen: '/og-image.jpg', // 1200x630
};

const { calle, codigoPostal, localidad, provincia } = NEGOCIO.direccion;
export const lineaLocalidad = `${codigoPostal} ${localidad}, ${provincia}`;
export const direccionCompleta = `${calle}, ${lineaLocalidad}`;

// Google Maps embebido sin API key. Solo la dirección: con "Koh Tao" Google podría mostrar la isla de Tailandia
export const mapaEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(direccionCompleta)}&output=embed`;
export const mapaComoLlegarUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(direccionCompleta)}`;
export const telefonoHref = NEGOCIO.telefono ? `tel:${NEGOCIO.telefono.replace(/\s/g, '')}` : null;
