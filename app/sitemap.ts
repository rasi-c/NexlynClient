import { productAPI, categoryAPI } from '../lib/api';

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexlyn.com';

    // Base routes
    const routes = ['', '/products', '/contact'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        // Fetch products and categories for dynamic routes
        // Use a high limit for sitemap to catch all products
        const [productsRes, categoriesRes] = await Promise.all([
            productAPI.getAll(),
            categoryAPI.getAll(),
        ]);

        const productsData = productsRes.data.products || productsRes.data;

        const productEntries = productsData.map((product: any) => ({
            url: `${baseUrl}/product/${product._id}`,
            lastModified: product.updatedAt || new Date().toISOString(),
            changeFrequency: 'weekly',
            priority: 0.6,
        }));

        const categoryEntries = categoriesRes.data.map((category: any) => ({
            url: `${baseUrl}/category/${category._id}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly',
            priority: 0.5,
        }));

        return [...routes, ...productEntries, ...categoryEntries];
    } catch (error) {
        console.error('Sitemap generation error:', error);
        return routes;
    }
}
