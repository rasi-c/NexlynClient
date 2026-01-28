import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

const mockProduct = {
    _id: '123',
    name: 'Premium Watch',
    description: 'A very premium watch for testing.',
    price: 15000,
    images: ['/test-watch.jpg'],
    category: { name: 'Accessories' },
    inStock: true
};

describe('ProductCard Component', () => {
    it('renders product details correctly', () => {
        render(<ProductCard product={mockProduct} />);

        expect(screen.getByText('Premium Watch')).toBeInTheDocument();
        expect(screen.getByText('₹15,000')).toBeInTheDocument();
        expect(screen.getByText('Accessories')).toBeInTheDocument();
    });

    it('shows out of stock badge when product is unavailable', () => {
        const outOfStockProduct = { ...mockProduct, inStock: false };
        render(<ProductCard product={outOfStockProduct} />);

        expect(screen.getByText(/Out of Stock/i)).toBeInTheDocument();
    });
});
