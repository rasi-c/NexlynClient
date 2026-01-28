import { productAPI, categoryAPI, bannerAPI } from '../lib/api';
import HomeClient from './HomeClient';

export const metadata = {
    title: 'NEXLYN | Premium E-commerce Experience',
    description: 'Discover a curated collection of premium products designed for modern living. Quality, innovation, and style at NEXLYN.',
    alternates: {
        canonical: '/',
    },
};

export default async function Home() {
    let banners = [];
    let products = [];
    let categories = [];

    try {
        console.log('Fetching initial data for Home Page...');
        const [bannerRes, categoryRes, productRes] = await Promise.all([
            bannerAPI.getAll(),
            categoryAPI.getAll(),
            productAPI.getAll()
        ]);

        console.log('Data fetched successfully');
        banners = bannerRes.data || [];
        categories = categoryRes.data || [];
        products = (productRes.data.products || productRes.data || []).slice(0, 8);
    } catch (error) {
        console.error('Error fetching data in server component:', error.message);
        if (error.response) {
            console.error('API Error Response:', error.response.data);
        }
    }

    return (
        <HomeClient
            initialBanners={banners}
            initialCategories={categories}
            initialProducts={products}
        />
    );
}
