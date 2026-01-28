import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { adminAPI } from '../../../lib/api';
import { useRouter } from 'next/navigation';

// Mock the next/navigation useRouter
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock the API
jest.mock('../../../lib/api', () => ({
    adminAPI: {
        login: jest.fn(),
    },
}));

describe('Admin Login Page', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        useRouter.mockReturnValue({
            push: mockPush,
        });
    });

    it('successful login redirects to dashboard', async () => {
        adminAPI.login.mockResolvedValue({
            data: { token: 'mock-token', name: 'Admin' }
        });

        render(<LoginPage />);

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'admin@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/admin/dashboard');
            expect(localStorage.getItem('adminToken')).toBe('mock-token');
        });
    });

    it('failed login shows error message', async () => {
        adminAPI.login.mockRejectedValue({
            response: { data: { message: 'Invalid credentials' } }
        });

        render(<LoginPage />);

        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
        });
    });
});
