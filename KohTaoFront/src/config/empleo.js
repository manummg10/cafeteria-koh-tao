// 💼 Oferta de empleo (página /trabaja-con-nosotros y aviso en la portada).
// Para cerrar la oferta: activa = false (quita el aviso de la portada y la página lo indica).
export const EMPLEO = {
  activa: true,
  puesto: 'Camareros/as',
  email: 'kohtaocafeelejido@gmail.com',
  asuntoEmail: 'Candidatura camarero/a - Koh Tao Café',
  fechaPublicacion: '2026-10-31', // AAAA-MM-DD (Google Empleos)
  aperturaProxima: true, // muestra "Próximamente nueva apertura en El Ejido"
  intro:
    'Buscamos personas proactivas, responsables y con buena actitud, con ganas de trabajar y de formar parte de un equipo dinámico.',
  imprescindible: 'Excelente trato y atención al cliente.',
  valoramos: [
    { id: 'presencia', texto: 'Buena presencia y actitud positiva' },
    { id: 'agilidad', texto: 'Agilidad y organización' },
    { id: 'equipo', texto: 'Capacidad para trabajar en equipo' },
    { id: 'compromiso', texto: 'Compromiso y responsabilidad' },
    { id: 'experiencia', texto: 'Experiencia en hostelería' },
  ],
  cierre: 'Buscamos personas que disfruten cuidando cada detalle y haciendo que nuestros clientes quieran volver.',
};

export const RUTA_EMPLEO = '/trabaja-con-nosotros/';

export const SEO_EMPLEO = {
  titulo: 'Trabaja con nosotros | Koh Tao Café busca camareros/as en El Ejido',
  descripcion:
    'Próxima apertura de Koh Tao Café en El Ejido (Almería). Buscamos camareros/as con excelente trato al cliente. ¡Envíanos tu CV!',
  imagen: '/empleo-cartel.jpg',
};

// Texto que aparece ya escrito al abrir el correo (el candidato solo rellena y adjunta el CV)
const CUERPO_EMAIL = `Hola, equipo de Koh Tao Café:

Me gustaría optar al puesto de ${EMPLEO.puesto.toLowerCase()}. Os adjunto mi CV.

Nombre:
Teléfono:
Disponibilidad:

¡Gracias!`;

export const mailtoEmpleo =
  `mailto:${EMPLEO.email}?subject=${encodeURIComponent(EMPLEO.asuntoEmail)}&body=${encodeURIComponent(CUERPO_EMAIL)}`;
