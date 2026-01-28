import { productAPI } from '../lib/api';
import axios from 'axios';

jest.mock('axios', () => ({
    create: jest.fn(() => ({
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
            request: { use: jest.fn(), eject: jest.fn() },
            response: { use: jest.fn(), eject: jest.fn() },
        },
    })),
}));

const mockAPI = axios.create();

describe('Product API Service', () => {
    it('fetches products successfully', async () => {
        const mockData = { data: { products: [{ name: 'Test' }] } };
        (mockAPI.get as jest.Mock).mockResolvedValue(mockData);

        const result = await productAPI.getAll();
        expect(mockAPI.get).toHaveBeenCalledWith('/products', { params: {} });
    });

    it('fetches a single product by ID', async () => {
        const mockProduct = { data: { name: 'Single Product' } };
        (mockAPI.get as jest.Mock).mockResolvedValue(mockProduct);

        await productAPI.getById('123');
        expect(mockAPI.get).toHaveBeenCalledWith('/products/123');
    });
});
