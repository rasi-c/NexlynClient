'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productAPI, categoryAPI } from '../../../lib/api';
import { toast } from 'react-hot-toast';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaFilter,
    FaBoxOpen,
    FaCheckCircle,
    FaTimesCircle,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';

/**
 * Admin Product Management Page
 * Displays a sortable, filterable list of all products.
 */
export default function ManageProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [prodRes, catRes] = await Promise.all([
                productAPI.getAll(),
                categoryAPI.getAll()
            ]);
            const productsData = prodRes.data.products || prodRes.data;
            setProducts(productsData);
            setCategories(catRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            try {
                await productAPI.delete(id);
                toast.success('Product deleted');
                setProducts(products.filter(p => p._id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Error deleting product');
            }
        }
    };

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category?._id === selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading && products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Gathering Inventory...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Product Catalog</h1>
                    <p className="text-gray-500 font-medium font-inter">Manage your stock, prices, and visibility.</p>
                </div>
                <Link
                    href="/admin/products/add"
                    className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center space-x-3 shadow-xl shadow-blue-200 hover:bg-red-700 transition-all transform active:scale-95"
                >
                    <FaPlus />
                    <span>Add New Product</span>
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300">
                <div className="relative flex-grow">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search by product name..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-medium"
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none appearance-none transition-all font-bold text-gray-700"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table Container */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Details</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Price</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Stock</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currentProducts.length > 0 ? currentProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                                                <img
                                                    src={product.images?.[0] || '/placeholder-product.png'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="max-w-xs">
                                                <span className="font-black text-gray-900 block truncate" title={product.name}>{product.name}</span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">SKU: {product._id.slice(-8).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="inline-block bg-red-50 text-red-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">
                                            {product.category?.name || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center font-black text-gray-900">
                                        ₹{product.price.toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-center">
                                            {product.inStock ? (
                                                <span className="flex items-center text-green-600 text-[10px] font-black uppercase tracking-tighter">
                                                    <FaCheckCircle className="mr-1 text-sm" /> Available
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-red-400 text-[10px] font-black uppercase tracking-tighter">
                                                    <FaTimesCircle className="mr-1 text-sm" /> Sold Out
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-end space-x-2">
                                            <Link
                                                href={`/admin/products/edit/${product._id}`}
                                                className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                                                title="Edit Product"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id, product.name)}
                                                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                                                title="Delete Product"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-4">
                                                <FaBoxOpen className="text-3xl text-gray-300" />
                                            </div>
                                            <p className="font-bold text-gray-400">No products found matching your criteria.</p>
                                            <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="text-red-600 text-sm font-bold mt-2 hover:underline">Clear all filters</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Section */}
                {totalPages > 1 && (
                    <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} entries
                        </p>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => paginate(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30 transition-all"
                            >
                                <FaChevronLeft />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => paginate(i + 1)}
                                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === i + 1
                                        ? 'bg-red-600 text-white shadow-lg shadow-blue-200'
                                        : 'text-gray-500 hover:bg-white border border-transparent hover:border-gray-200'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30 transition-all"
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Helper */}
            <div className="text-center">
                <p className="text-gray-400 text-xs font-medium">
                    Tip: Use the search bar to quickly find products by name or SKU.
                </p>
            </div>
        </div>
    );
}
