import axios from 'axios';

// Cliente HTTP único. En producción el front y la API comparten origen (baseURL vacío);
// withCredentials envía la cookie HttpOnly de sesión: el JS nunca ve el token.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
});

export default api;
