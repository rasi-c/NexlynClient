import { categoryAPI, productAPI } from '../../../lib/api';
import CategoryClient from './CategoryClient';

export async function generateMetadata({ params }) {
    const { id } = params;
    try {
        const res = await categoryAPI.getById(id);
        const category = res.data;

        return {
            title: category.name,
            description: category.description || `Browse products in ${category.name}`,
            openGraph: {
                title: category.name,
                description: category.description,
                images: [category.image || '/og-image.png'],
            },
        };
    } catch (error) {
        return {
            title: 'Category Not Found',
        };
    }
}

export default async function CategoryPage({ params }) {
    const { id } = params;
    let category = null;
    let products = [];

    try {
        const [catRes, prodRes] = await Promise.all([
            categoryAPI.getById(id),
            productAPI.getByCategory(id)
        ]);
        category = catRes.data;
        products = prodRes.data;
    } catch (error) {
        console.error('Error fetching category in server component:', error);
    }

    return (
        <CategoryClient
            id={id}
            initialCategory={category}
            initialProducts={products}
        />
    );
}
