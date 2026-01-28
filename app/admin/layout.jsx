'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { adminAPI } from '../../lib/api';
import {
    FaChartPie,
    FaImages,
    FaThList,
    FaBoxOpen,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaUserCircle
} from 'react-icons/fa';

/**
 * Admin Layout
 * Handles authentication protection and provides shared navigation sidebar.
 */
export default function AdminLayout({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminUser, setAdminUser] = useState(null);

    const router = useRouter();
    const pathname = usePathname();

    // Don't apply layout/auth check to the login page
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) {
            setLoading(false);
            return;
        }

        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    router.push('/admin/login');
                    return;
                }

                const response = await adminAPI.verify();
                if (response.data.authenticated) {
                    setIsAdmin(true);
                    setAdminUser(response.data.admin);
                } else {
                    router.push('/admin/login');
                }
            } catch (error) {
                console.error('Auth verification failed:', error);
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router, isLoginPage]);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out of the Admin Panel?')) {
            // 1. Remove JWT token from local storage
            localStorage.removeItem('adminToken');

            // 2. Reset admin states
            setIsAdmin(false);
            setAdminUser(null);

            // 3. Optional: Call backend logout if needed
            if (adminAPI.logout) adminAPI.logout();

            // 4. Redirect to login page
            router.push('/admin/login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-red-500 font-bold tracking-widest uppercase text-xs">Authenticating...</p>
                </div>
            </div>
        );
    }

    // Standalone view for login page
    if (isLoginPage) {
        return <>{children}</>;
    }

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: FaChartPie },
        { name: 'Manage Banners', path: '/admin/banners', icon: FaImages },
        { name: 'Manage Categories', path: '/admin/categories', icon: FaThList },
        { name: 'Manage Products', path: '/admin/products', icon: FaBoxOpen },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 bg-red-600 text-white p-4 rounded-full shadow-2xl"
            >
                {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar Navigation */}
            <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-gray-900 text-gray-400 transition-transform duration-300 transform 
        lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="h-full flex flex-col p-6">
                    <div className="mb-10 px-4">
                        <h1 className="text-2xl font-black text-white tracking-tighter">NEXLYN <span className="text-red-500 italic text-xs ml-1 font-bold">CMS</span></h1>
                    </div>

                    <nav className="flex-grow space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-red-600 text-white shadow-lg shadow-blue-900/50'
                                        : 'hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    <item.icon className={`text-lg transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-red-400'}`} />
                                    <span className="font-semibold text-sm">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 mt-auto border border-gray-800"
                    >
                        <FaSignOutAlt className="text-lg" />
                        <span className="font-semibold text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow flex flex-col">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="lg:hidden">
                        <h2 className="font-black text-gray-900 text-xl tracking-tighter">NEXLYN</h2>
                    </div>
                    <div className="hidden lg:block">
                        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                            {menuItems.find(item => item.path === pathname)?.name || 'Admin Panel'}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900">{adminUser?.name || 'Admin'}</p>
                            <p className="text-[10px] font-bold text-red-600 uppercase tracking-tighter">Authorized Access</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-blue-100">
                            <FaUserCircle className="text-2xl" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 pb-20">
                    {children}
                </main>
            </div>
        </div>
    );
}
