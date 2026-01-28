import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactPage from './page';
import { toast } from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('ContactPage Form', () => {
    it('updates input values on change', () => {
        render(<ContactPage />);

        const nameInput = screen.getByPlaceholderText(/John Doe/i);
        fireEvent.change(nameInput, { target: { value: 'Test User', name: 'name' } });
        expect(nameInput.value).toBe('Test User');
    });

    it('shows validation errors for invalid email', async () => {
        render(<ContactPage />);

        const emailInput = screen.getByPlaceholderText(/john@example.com/i);
        fireEvent.change(emailInput, { target: { value: 'invalid-email', name: 'email' } });
        fireEvent.click(screen.getByText(/Send Message/i));

        await waitFor(() => {
            expect(screen.getByText(/Please enter a valid email/i)).toBeInTheDocument();
        });
    });

    it('successfully submits the form and shows toast', async () => {
        render(<ContactPage />);

        fireEvent.change(screen.getByPlaceholderText(/John Doe/i), { target: { value: 'Jane Doe', name: 'name' } });
        fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), { target: { value: 'jane@example.com', name: 'email' } });
        fireEvent.change(screen.getByPlaceholderText(/Pricing Inquiry/i), { target: { value: 'Question', name: 'subject' } });
        fireEvent.change(screen.getByPlaceholderText(/Tell us how we can help/i), { target: { value: 'This is a long enough message for testing.', name: 'message' } });

        fireEvent.click(screen.getByText(/Send Message/i));

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Your message has been sent successfully!');
            expect(screen.getByText(/Message Sent!/i)).toBeInTheDocument();
        }, { timeout: 3000 });
    });
});
