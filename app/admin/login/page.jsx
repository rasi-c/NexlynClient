'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '../../../lib/api';
import { FaLock, FaEnvelope, FaExclamationCircle } from 'react-icons/fa';
import { validateEmail, validateRequired } from '../../../lib/validation';
import { toast } from 'react-hot-toast';

/**
 * Admin Login Page
 * Standalone page for admin authentication.
 */
export default function AdminLoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        const emailError = validateEmail(formData.email);
        const passError = validateRequired(formData.password, 'Password');

        if (emailError || passError) {
            toast.error(emailError || passError);
            return;
        }

        setLoading(true);

        try {
            const response = await adminAPI.login(formData);
            const { token } = response.data;

            // Store token in localStorage
            localStorage.setItem('adminToken', token);

            toast.success('Welcome back, Admin!');

            // Redirect to dashboard
            router.push('/admin/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            toast.error(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full">
                {/* Logo/Branding */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-red-600 tracking-tighter mb-2">NEXLYN</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Admin Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Sign In</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <FaEnvelope />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                                    placeholder="admin@nexlyn.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <FaLock />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 transition-all transform active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Authenticating...
                                </div>
                            ) : (
                                'Sign In to Dashboard'
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <a href="/" className="text-red-600 font-bold hover:underline text-sm">
                            ← Back to Website
                        </a>
                    </div>
                </div>

                {/* Footer Info */}
                <p className="text-center text-gray-400 text-xs mt-8 font-medium">
                    © {new Date().getFullYear()} NEXLYN. Authorized Access Only.
                </p>
            </div>

            <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
        </div>
    );
}
