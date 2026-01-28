import { render, screen } from '@testing-library/react';
import Carousel from './Carousel';

const mockBanners = [
    { _id: '1', image: '/banner1.jpg', title: 'Summer Collection', link: '/summer' },
    { _id: '2', image: '/banner2.jpg', title: 'Winter Sale', link: '/winter' }
];

// Mock Swiper since it's hard to test in JSDOM
jest.mock('swiper/react', () => ({
    Swiper: ({ children }) => <div data-testid="swiper-mock">{children}</div>,
    SwiperSlide: ({ children }) => <div data-testid="swiper-slide-mock">{children}</div>,
}));

jest.mock('swiper/modules', () => ({
    Autoplay: jest.fn(),
    Navigation: jest.fn(),
    Pagination: jest.fn(),
}));

describe('Carousel Component', () => {
    it('renders banners correctly', () => {
        render(<Carousel banners={mockBanners} />);

        expect(screen.getByTestId('swiper-mock')).toBeInTheDocument();
        expect(screen.getByText('Summer Collection')).toBeInTheDocument();
    });

    it('handles empty banners array gracefully', () => {
        const { container } = render(<Carousel banners={[]} />);
        expect(container.firstChild).toBeNull();
    });
});
