'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    const pathname = usePathname();
    const currentYear = new Date().getFullYear();

    // Do not render Footer on admin routes
    if (pathname?.startsWith('/admin')) return null;

    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: Company Info */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tighter text-red-500">NEXLYN</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Supplying genuine MikroTik networking solutions including routers, switches,
                            and wireless devices. NEXLYN is committed to reliable connectivity, quality
                            products, and dedicated customer support.
                        </p>
                    </div>


                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 relative inline-block">
                            Quick Links
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-red-600"></span>
                        </h3>
                        <ul className="space-y-4">
                            {['Home', 'Products', 'About Us', 'Contact Us'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-gray-400 hover:text-red-500 hover:translate-x-1 transition-all duration-300 inline-block text-sm"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 relative inline-block">
                            Contact Us
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-red-600"></span>
                        </h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start space-x-3">
                                <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                                <span>Dubai,UAE</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FaPhoneAlt className="text-red-500 flex-shrink-0" />
                                <span>+971 56 922 3145</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FaEnvelope className="text-red-500 flex-shrink-0" />
                                <span>info@nexlyndistribution.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Social Media */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 relative inline-block">
                            Follow Us
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-red-600"></span>
                        </h3>
                        <div className="flex space-x-4">
                            {[
                                { Icon: FaFacebook, link: '#', label: 'Facebook' },
                                { Icon: FaTwitter, link: '#', label: 'Twitter' },
                                { Icon: FaInstagram, link: '#', label: 'Instagram' },
                                { Icon: FaLinkedin, link: '#', label: 'LinkedIn' },
                            ].map(({ Icon, link, label }) => (
                                <a
                                    key={label}
                                    href={link}
                                    aria-label={label}
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all duration-300 group"
                                >
                                    <Icon className="text-xl group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                        <div className="mt-8">
                            <p className="text-sm font-medium text-gray-400 mb-2">Subscribe to our newsletter</p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="bg-gray-800 border-none rounded-l-lg px-4 py-2 w-full focus:ring-1 focus:ring-blue-500 text-sm outline-none"
                                />
                                <button className="bg-red-600 px-4 py-2 rounded-r-lg hover:bg-red-700 transition-colors text-sm font-bold">
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-gray-500 text-xs">
                    <p>© {currentYear} NEXLYN. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link href="/privacy" className="hover:text-red-500 transition-colors underline decoration-gray-800 underline-offset-4">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-red-500 transition-colors underline decoration-gray-800 underline-offset-4">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
