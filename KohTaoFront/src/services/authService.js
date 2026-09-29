import api from './api';

export const authService = {
  login: (email, password) => api.post('/api/auth/login', { email, password }).then(r => r.data),
  logout: () => api.post('/api/auth/logout'),
  me: () => api.get('/api/auth/me').then(r => r.data),
};
