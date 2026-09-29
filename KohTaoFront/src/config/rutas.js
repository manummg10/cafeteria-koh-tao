// Ruta del panel interno: no se enlaza desde la web pública.
// Se define en Netlify con VITE_RUTA_PANEL (p. ej. "/gestion-xxxx") para no dejarla escrita en el repositorio.
// Ojo: ocultar la ruta solo evita curiosos; la protección real es la autenticación del backend.
const normalizar = ruta => `/${ruta.trim().replace(/^\/+|\/+$/g, '')}`;

export const RUTA_PANEL = normalizar(import.meta.env.VITE_RUTA_PANEL || 'panel-control-interno');
export const RUTA_PANEL_DASHBOARD = `${RUTA_PANEL}/dashboard`;
