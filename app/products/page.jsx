'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { productAPI } from '../../lib/api';
import { FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * All Products Page
 * Displays a searchable and filterable list of every product in the catalog.
 */
export default function AllProductsPage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const res = await productAPI.getAll({ page: currentPage, limit: 12 });
                const data = res.data.products || res.data;
                setProducts(data);
                setFilteredProducts(data);
                setTotalPages(res.data.pages || 1);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
        window.scrollTo(0, 0); // Scroll to top on page change
    }, [currentPage]);

    // Reset page on search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Handle Search
    useEffect(() => {
        const results = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(results);
    }, [searchTerm, products]);

    if (loading) {
        return <Loading fullScreen />;
    }

    if (error) {
        return (
            <div className="min-h-screen pt-20 md:pt-32">
                <ErrorMessage message={error} onRetry={() => window.location.reload()} />
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-28 pb-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header & Search Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 md:mb-16 gap-6 md:gap-10">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
                            All Products
                        </h1>
                        <p className="text-gray-500 font-medium text-sm md:text-base">
                            Discover our complete collection of premium items.
                        </p>
                    </div>

                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products or categories..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                {/* Results Info */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                        {searchTerm ? `Results for "${searchTerm}"` : 'Showing all products'}
                        <span className="ml-2 text-red-600">({filteredProducts.length})</span>
                    </p>
                    <div className="flex items-center text-gray-400 text-sm italic">
                        <FaFilter className="mr-2" />
                        Sort: Newest First
                    </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-dashed border-gray-200 mt-10">
                        <div className="text-6xl mb-6">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No matches found</h3>
                        <p className="text-gray-500 mb-8">Try adjusting your search terms to find what you're looking for.</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="bg-red-50 text-red-600 px-6 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors"
                        >
                            Clear Search
                        </button>
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && !searchTerm && (
                    <div className="mt-16 flex justify-center items-center space-x-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-all font-bold"
                        >
                            <FaChevronLeft />
                        </button>

                        <div className="flex space-x-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${currentPage === i + 1
                                        ? 'bg-red-600 text-white shadow-xl shadow-blue-200'
                                        : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-all font-bold"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
