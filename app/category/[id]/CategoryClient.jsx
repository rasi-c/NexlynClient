'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../../../components/ProductCard';
import Loading from '../../../components/Loading';
import ErrorMessage from '../../../components/ErrorMessage';
import { productAPI, categoryAPI } from '../../../lib/api';

export default function CategoryClient({ id, initialCategory, initialProducts }) {
    const [category, setCategory] = useState(initialCategory);
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(!initialCategory);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
            if (initialCategory) return;
            try {
                setLoading(true);
                const [catRes, prodRes] = await Promise.all([
                    categoryAPI.getById(id),
                    productAPI.getByCategory(id)
                ]);

                setCategory(catRes.data);
                setProducts(prodRes.data);
            } catch (err) {
                console.error('Error fetching category data:', err);
                setError('Failed to load category products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id && !initialCategory) {
            fetchCategoryData();
        }
    }, [id, initialCategory]);

    if (loading) {
        return <Loading fullScreen />;
    }

    if (error || !category) {
        return (
            <div className="min-h-screen pt-28">
                <ErrorMessage message={error || 'Category not found'} onRetry={() => window.location.reload()} />
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-28 pb-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Category Header */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12 text-center md:text-left overflow-hidden relative">
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tighter">
                            {category.name}
                        </h1>
                        {category.description && (
                            <p className="text-gray-600 text-lg max-w-3xl leading-relaxed">
                                {category.description}
                            </p>
                        )}
                        <div className="mt-6 flex items-center justify-center md:justify-start space-x-2 text-sm text-red-600 font-bold uppercase tracking-widest">
                            <span>Collections</span>
                            <span>/</span>
                            <span className="text-gray-400">{category.name}</span>
                        </div>
                    </div>

                    {/* Subtle Decorative Background Element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
                </div>

                {/* Products Grid */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            Products <span className="text-gray-400 font-normal ml-2">({products.length})</span>
                        </h2>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-dashed border-gray-300">
                            <div className="text-6xl mb-6">📦</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
                            <p className="text-gray-500 mb-8">We couldn't find any products in this category at the moment.</p>
                            <a href="/" className="inline-block bg-red-50 text-red-600 px-6 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors">
                                Explore other categories
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
