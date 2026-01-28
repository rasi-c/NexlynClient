'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const Carousel = dynamic(() => import('../components/Carousel'), {
    ssr: false,
    loading: () => <div className="w-full h-[400px] bg-gray-100 animate-pulse"></div>
});
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { productAPI, categoryAPI, bannerAPI } from '../lib/api';

export default function HomeClient({ initialBanners, initialCategories, initialProducts }) {
    const [banners, setBanners] = useState(initialBanners);
    const [products, setProducts] = useState(initialProducts);
    const [categories, setCategories] = useState(initialCategories);
    const [loading, setLoading] = useState(!initialBanners);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (initialBanners) return;
            try {
                setLoading(true);
                const [bannerRes, categoryRes, productRes] = await Promise.all([
                    bannerAPI.getAll(),
                    categoryAPI.getAll(),
                    productAPI.getAll()
                ]);

                setBanners(bannerRes.data);
                setCategories(categoryRes.data);
                const fetchedProducts = productRes.data.products || productRes.data;
                setProducts(fetchedProducts.slice(0, 8));
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load content. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [initialBanners]);

    if (loading) {
        return <Loading fullScreen />;
    }

    if (error) {
        return (
            <div className="min-h-screen pt-20">
                <ErrorMessage message={error} onRetry={() => window.location.reload()} />
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col">
            {/* 1. Carousel Section */}
            <section className="w-full">
                <Carousel banners={banners} />
            </section>

            {/* 2. About Us Section */}
            <section className="py-12 md:py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <span
                        className="text-6xl font-black text-red-600 tracking-tighter drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                        style={{ lineHeight: "0.75" }}
                    >
                        N
                    </span>
                    <span className="text-5xl font-bold text-slate-900 tracking-tight ml-0.5">
                        EXLYN
                    </span>

                    <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-6 md:mb-8 tracking-tighter leading-tight">
                        Powering Reliable Connectivity with NEXLYN
                    </h3>

                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        NEXLYN is a trusted supplier of professional networking solutions,
                        specializing in genuine <strong>MikroTik routers, switches, and wireless devices</strong>.
                        Our product range is built to deliver performance, stability, and scalability
                        for homes, businesses, and ISP networks.
                        <br /><br />
                        Whether you are deploying a new network or upgrading existing infrastructure,
                        NEXLYN provides dependable technology backed by expertise and support.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="px-6 py-3 bg-red-50 rounded-2xl border border-red-100">
                            <span className="block text-2xl font-bold text-red-600">100%</span>
                            <span className="text-xs text-red-400 font-bold uppercase tracking-wider">
                                Genuine MikroTik Products
                            </span>
                        </div>

                        <div className="px-6 py-3 bg-red-50 rounded-2xl border border-red-100">
                            <span className="block text-2xl font-bold text-red-600">24/7</span>
                            <span className="text-xs text-red-400 font-bold uppercase tracking-wider">
                                Technical & Sales Support
                            </span>
                        </div>
                    </div>
                </div>
            </section>


            {/* 3. Featured Products Section */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4">
                        <div>
                            <h2 className="text-red-600 font-bold tracking-widest uppercase text-xs md:text-sm mb-2">Exclusive Collection</h2>
                            <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Featured Products</h3>
                        </div>
                        <button className="hidden md:block text-red-600 font-bold hover:underline">View All Products →</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    <div className="mt-12 text-center md:hidden">
                        <button className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-200">
                            View All Products
                        </button>
                    </div>
                </div>
            </section>

            {/* 4. Categories Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 md:mb-20">
                        <h2 className="text-red-600 font-bold tracking-widest uppercase text-xs md:text-sm mb-2">Browse by Theme</h2>
                        <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Top Categories</h3>
                        <div className="w-20 h-1.5 bg-red-600 mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {categories.map((category) => (
                            <CategoryCard key={category._id} category={category} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-red-600 bg-[linear-gradient(45deg,#dc2626_25%,#ef4444_75%)]">
                <div className="max-w-4xl mx-auto px-4 text-center text-white">
                    <h3 className="text-3xl font-bold mb-6">Need a Custom Quote?</h3>
                    <p className="text-red-100 text-lg mb-8 opacity-90">
                        Contact us today for bulk orders or specialized product requirements.
                        Our experts are ready to assist you.
                    </p>
                    <button className="bg-white text-red-600 hover:bg-gray-100 px-10 py-4 rounded-2xl font-extrabold transition-all transform hover:scale-105 shadow-xl">
                        WhatsApp Us Now
                    </button>
                </div>
            </section>
        </main>
    );
}
