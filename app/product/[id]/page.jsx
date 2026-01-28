import { productAPI } from '../../../lib/api';
import ProductClient from './ProductClient';

export async function generateMetadata({ params }) {
    const { id } = params;
    try {
        const res = await productAPI.getById(id);
        const product = res.data;

        return {
            title: product.name,
            description: product.description.substring(0, 160),
            openGraph: {
                title: product.name,
                description: product.description.substring(0, 160),
                images: [product.images?.[0] || '/og-image.png'],
            },
        };
    } catch (error) {
        return {
            title: 'Product Not Found',
        };
    }
}

export default async function ProductPage({ params }) {
    const { id } = params;
    let product = null;

    try {
        const res = await productAPI.getById(id);
        product = res.data;
    } catch (error) {
        console.error('Error fetching product in server component:', error);
    }

    return <ProductClient id={id} initialProduct={product} />;
}
