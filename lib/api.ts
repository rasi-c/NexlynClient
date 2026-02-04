import axios from 'axios';

// Determine if we are on local or production
// Use environment variable if available, otherwise fallback to logic
const getBaseURL = () => {
    // If explicit API URL is set in env, use it (works in both environments)
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

    // Browser context
    if (typeof window !== 'undefined') {
        return window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')
            ? 'http://localhost:5000/api'
            : 'https://backend.nexlyndistribution.com/api';
    }

    // Server context (SSR)
    return process.env.NODE_ENV === 'production'
        ? 'https://backend.nexlyndistribution.com/api'
        : 'http://localhost:5000/api';
};

const API = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
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
    getFeatured: (params = {}) => API.get('/products', { params }),
};

export const categoryAPI = {
    getAll: () => API.get('/categories'),
    getById: (id: string) => API.get(`/categories/${id}`),
    create: (data: FormData) => API.post('/categories', data, formDataConfig),
    update: (id: string, data: FormData) => API.put(`/categories/${id}`, data, formDataConfig),
    delete: (id: string) => API.delete(`/categories/${id}`),
};

export const bannerAPI = {
    // Adding a timestamp prevents the browser from serving a cached version
    getAll: () => API.get(`/banners?t=${new Date().getTime()}`),

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
