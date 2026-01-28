'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Do not render Navbar on admin routes
    if (pathname?.startsWith('/admin')) return null;

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact Us', path: '/contact' },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <div className="flex flex-col leading-none">
                                <div className="flex items-baseline">
                                    <span
                                        className="text-4xl font-black text-red-600 tracking-tighter drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                                        style={{ lineHeight: '0.75' }}
                                    >
                                        N
                                    </span>
                                    <span className="text-2xl font-bold text-slate-900 tracking-tight ml-0.5">
                                        EXLYN
                                    </span>
                                </div>

                                <span className="mt-1 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                    Distribution
                                </span>
                            </div>
                        </Link>
                    </div>


                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.path;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.path}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative group ${isActive
                                            ? 'text-red-600'
                                            : scrolled ? 'text-gray-700 hover:text-red-600' : 'text-gray-800 hover:text-red-600'
                                            }`}
                                    >
                                        {link.name}
                                        <span
                                            className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${isActive ? 'scale-x-100' : ''
                                                }`}
                                        ></span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`inline-flex items-center justify-center p-2 rounded-md transition-colors ${scrolled ? 'text-gray-700 hover:text-red-600' : 'text-gray-800 hover:text-red-600'
                                } focus:outline-none`}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <HiX className="block h-7 w-7" /> : <HiMenuAlt3 className="block h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Mobile Menu Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full pt-20 pb-6 px-6">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-5 right-5 p-2 text-gray-500 hover:text-red-600 transition-colors"
                    >
                        <HiX className="h-8 w-8" />
                    </button>

                    <div className="space-y-4">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className={`block px-4 py-3 text-lg font-semibold rounded-xl transition-all ${isActive
                                        ? 'bg-red-50 text-red-600 border-r-4 border-red-600'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-auto border-t pt-6">
                        <p className="text-gray-400 text-sm mb-4">Quality and Excellence</p>
                        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-3 rounded-xl text-center font-bold">
                            Get a Quote
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
