import axios from 'axios';

// Determine if we are on local or production
const isProd = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');

const API = axios.create({
    // Use your actual backend domain here
    baseURL: isProd 
        ? 'https://backend.nexlyndistribution.com/api' // Replace with your actual live API URL
        : 'http://localhost:5000/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding JWT token
API.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Helper for multipart/form-data (file uploads)
const formDataConfig = {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
};

export const productAPI = {
    getAll: (params = {}) => API.get('/products', { params }),
    getById: (id: string) => API.get(`/products/${id}`),
    getByCategory: (categoryId: string) => API.get(`/products/category/${categoryId}`),
    create: (data: FormData) => API.post('/products', data, formDataConfig),
    update: (id: string, data: FormData) => API.put(`/products/${id}`, data, formDataConfig),
    delete: (id: string) => API.delete(`/products/${id}`),
};

export const categoryAPI = {
    getAll: () => API.get('/categories'),
    getById: (id: string) => API.get(`/categories/${id}`),
    create: (data: FormData) => API.post('/categories', data, formDataConfig),
    update: (id: string, data: FormData) => API.put(`/categories/${id}`, data, formDataConfig),
    delete: (id: string) => API.delete(`/categories/${id}`),
};

export const bannerAPI = {
    getAll: () => API.get('/banners'),
    create: (data: FormData) => API.post('/banners', data, formDataConfig),
    update: (id: string, data: FormData) => API.put(`/banners/${id}`, data, formDataConfig),
    delete: (id: string) => API.delete(`/banners/${id}`),
};

export const adminAPI = {
    login: (credentials: any) => API.post('/admin/login', credentials),
    register: (details: any) => API.post('/admin/register', details),
    verify: () => API.get('/admin/verify'),
    logout: () => Promise.resolve({ data: { message: 'Logged out successfully' } }), // Placeholder for client-side clearing
};

export default API;
