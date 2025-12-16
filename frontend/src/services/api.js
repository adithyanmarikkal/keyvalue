import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    checkAuth: () => api.get('/auth/check'),
    tenantLogin: (credentials) => api.post('/auth/tenant-login', credentials),
};

// Tenants API
export const tenantsAPI = {
    getAll: () => api.get('/tenants'),
    getById: (id) => api.get(`/tenants/${id}`),
    create: (data) => api.post('/tenants', data),
    update: (id, data) => api.put(`/tenants/${id}`, data),
    delete: (id) => api.delete(`/tenants/${id}`),
};

// Complaints API
export const complaintsAPI = {
    getAll: () => api.get('/complaints'),
    getByTenant: (tenantId) => api.get(`/complaints/tenant/${tenantId}`),
    create: (data) => api.post('/complaints', data),
    updateStatus: (id, status) => api.put(`/complaints/${id}/status`, { status }),
};

export default api;
