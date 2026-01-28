'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FaBoxOpen,
    FaThList,
    FaImages,
    FaPlus,
    FaArrowRight,
    FaClock
} from 'react-icons/fa';
import { productAPI, categoryAPI, bannerAPI } from '../../../lib/api';

/**
 * Admin Dashboard Page
 * Provides an overview of the system with stats and quick actions.
 */
export default function AdminDashboard() {
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        banners: 0
    });
    const [recentProducts, setRecentProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [prodRes, catRes, banRes] = await Promise.all([
                    productAPI.getAll(),
                    categoryAPI.getAll(),
                    bannerAPI.getAll()
                ]);

                const productsData = prodRes.data.products || prodRes.data;
                const categoriesData = catRes.data;
                const bannersData = banRes.data;

                setStats({
                    products: prodRes.data.total || productsData.length,
                    categories: categoriesData.length,
                    banners: bannersData.length
                });

                // Get last 5 added products
                const sortedProducts = [...productsData]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5);

                setRecentProducts(sortedProducts);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-3xl"></div>)}
                </div>
                <div className="h-64 bg-gray-200 rounded-3xl"></div>
            </div>
        );
    }

    const statCards = [
        { name: 'Total Products', value: stats.products, icon: FaBoxOpen, color: 'bg-red-600', link: '/admin/products' },
        { name: 'Total Categories', value: stats.categories, icon: FaThList, color: 'bg-indigo-600', link: '/admin/categories' },
        { name: 'Total Banners', value: stats.banners, icon: FaImages, color: 'bg-purple-600', link: '/admin/banners' },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Overview</h1>
                <p className="text-gray-500 font-medium">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {statCards.map((stat, idx) => (
                    <Link key={idx} href={stat.link}>
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-[0.03] rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500`}></div>
                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.name}</p>
                                    <h3 className="text-4xl font-black text-gray-900">{stat.value}</h3>
                                </div>
                                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${stat.color.split('-')[1]}-200`}>
                                    <stat.icon className="text-2xl" />
                                </div>
                            </div>
                            <div className="mt-6 flex items-center text-gray-400 text-xs font-bold group-hover:text-red-600 transition-colors">
                                View Management <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Products Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <FaClock className="text-red-600" />
                                <h3 className="text-xl font-bold text-gray-900">Recently Added</h3>
                            </div>
                            <Link href="/admin/products" className="text-red-600 text-xs font-bold hover:underline">See All</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                                        <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                        <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentProducts.length > 0 ? recentProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-100">
                                                        <img src={product.images[0]} alt="" className="object-cover w-full h-full" />
                                                    </div>
                                                    <span className="font-bold text-gray-900 text-sm">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                                    {product.category?.name || 'General'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right font-black text-gray-900 text-sm">
                                                ₹{product.price.toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="px-8 py-20 text-center text-gray-400 font-medium">
                                                No products added yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 opacity-20 blur-3xl -mr-10 -mt-10"></div>
                        <h3 className="text-xl font-bold mb-8 relative z-10">Quick Actions</h3>
                        <div className="space-y-4 relative z-10">
                            <Link href="/admin/products?add=true" className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all border border-white/5 group">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                                        <FaPlus className="text-xs" />
                                    </div>
                                    <span className="font-bold text-sm">New Product</span>
                                </div>
                                <FaArrowRight className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link href="/admin/categories?add=true" className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all border border-white/5 group">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                                        <FaPlus className="text-xs" />
                                    </div>
                                    <span className="font-bold text-sm">New Category</span>
                                </div>
                                <FaArrowRight className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link href="/admin/banners?add=true" className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all border border-white/5 group">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                                        <FaPlus className="text-xs" />
                                    </div>
                                    <span className="font-bold text-sm">New Banner</span>
                                </div>
                                <FaArrowRight className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-red-600 rounded-[2.5rem] p-8 text-white shadow-lg shadow-blue-200">
                        <h4 className="font-black text-2xl mb-2">Need Help?</h4>
                        <p className="text-red-100 text-sm mb-6 opacity-80">Check out the documentation for managing your store.</p>
                        <button className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                            Read Guide
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
