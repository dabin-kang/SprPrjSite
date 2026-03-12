import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터 - JWT 토큰 자동 주입
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 오류 처리
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(
      error.response?.data?.message || '서버 오류가 발생했습니다'
    );
  }
);

// Auth API
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  checkId: (id) => api.get(`/auth/check-id?id=${id}`),
  checkEmail: (email) => api.get(`/auth/check-email?email=${email}`),
};

// Event API
export const eventApi = {
  getEvents: (page = 1, size = 9) => api.get(`/events?page=${page}&size=${size}`),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
};

// Project API
export const projectApi = {
  getProjects: (page = 1, size = 9) => api.get(`/projects?page=${page}&size=${size}`),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

// Inquiry API
export const inquiryApi = {
  createInquiry: (data) => api.post('/inquiries', data),
  getInquiries: (page = 1, size = 10) => api.get(`/inquiries?page=${page}&size=${size}`),
  getInquiry: (id) => api.get(`/inquiries/${id}`),
  answerInquiry: (id, answer) => api.post(`/inquiries/${id}/answer`, { answer }),
  deleteInquiry: (id) => api.delete(`/inquiries/${id}`),
};

// Magazine API
export const magazineApi = {
  getMagazines: (page = 1, size = 9, category = '') =>
    api.get(`/magazines?page=${page}&size=${size}${category ? `&category=${category}` : ''}`),
  getMagazine: (id) => api.get(`/magazines/${id}`),
  createMagazine: (data) => api.post('/magazines', data),
  updateMagazine: (id, data) => api.put(`/magazines/${id}`, data),
  deleteMagazine: (id) => api.delete(`/magazines/${id}`),
};

// Admin API
export const adminApi = {
  getUsers: (page = 1, size = 10) => api.get(`/admin/users?page=${page}&size=${size}`),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getStats: () => api.get('/admin/stats'),
};

export default api;
