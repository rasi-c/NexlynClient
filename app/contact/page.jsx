'use client';

import { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { validateEmail, validateRequired, validateLength } from '../../lib/validation';
import { toast } from 'react-hot-toast';

/**
 * Contact Us Page
 * Includes a contact form and company contact information.
 */
export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const newErrors = {
            name: validateLength(formData.name, 3, 50, 'Name') || validateRequired(formData.name, 'Name'),
            email: validateEmail(formData.email),
            subject: validateRequired(formData.subject, 'Subject'),
            message: validateLength(formData.message, 10, 1000, 'Message') || validateRequired(formData.message, 'Message'),
        };

        // Filter out nulls
        const filteredErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, v]) => v != null));

        if (Object.keys(filteredErrors).length > 0) {
            setErrors(filteredErrors);
            return;
        }

        setStatus({ loading: true, success: false, error: null });

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStatus({ loading: false, success: true, error: null });
            toast.success('Your message has been sent successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setErrors({});
        } catch (err) {
            setStatus({ loading: false, success: false, error: 'Failed to send message.' });
            toast.error('Failed to send message. Please try again.');
        }
    };

    return (
        <main className="min-h-screen pt-28 pb-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Contact Us
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Have a question or need a special quote? Reach out to our team and we'll get back to you as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Side: Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-gray-100">
                            {status.success ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FaCheckCircle className="text-4xl text-green-600" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h3>
                                    <p className="text-gray-600 mb-8">Thank you for reaching out. Our team will contact you shortly.</p>
                                    <button
                                        onClick={() => setStatus({ ...status, success: false })}
                                        className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2 ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-100'}`}
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-100'}`}
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2 ml-1">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="Pricing Inquiry / Bulk Order"
                                            className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all ${errors.subject ? 'border-red-500' : 'border-gray-100'}`}
                                        />
                                        {errors.subject && <p className="text-red-500 text-xs mt-1 ml-1">{errors.subject}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2 ml-1">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows="5"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell us how we can help..."
                                            className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none ${errors.message ? 'border-red-500' : 'border-gray-100'}`}
                                        ></textarea>
                                        {errors.message && <p className="text-red-500 text-xs mt-1 ml-1">{errors.message}</p>}
                                    </div>

                                    {status.error && <p className="text-red-500 text-sm font-medium">{status.error}</p>}

                                    <button
                                        type="submit"
                                        disabled={status.loading}
                                        className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all transform active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-xl shadow-blue-200"
                                    >
                                        {status.loading ? 'Sending...' : (
                                            <>
                                                <FaPaperPlane />
                                                <span>Send Message</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Contact Details */}
                    <div className="space-y-8">
                        <div className="bg-gray-900 text-white rounded-[2.5rem] shadow-xl p-10 flex flex-col h-full">
                            <h3 className="text-2xl font-bold mb-8">Contact Information</h3>

                            <div className="space-y-8 flex-grow">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <FaPhoneAlt />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Phone</p>
                                        <p className="text-lg font-medium">+971 56 922 3145</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Email</p>
                                        <p className="text-lg font-medium">info@nexlyndistribution.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Office</p>
                                        <p className="text-lg font-medium leading-tight">Deira,Dubai,UAE</p>
                                    </div>
                                </div>
                            </div>

                            {/* Socials */}
                            <div className="mt-12 pt-8 border-t border-gray-800">
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-6">Follow Us</p>
                                <div className="flex space-x-4">
                                    {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, idx) => (
                                        <a key={idx} href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-red-600 transition-all duration-300">
                                            <Icon className="text-xl" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Google Map Mockup */}
                        <div className="bg-white rounded-[2.5rem] shadow-lg p-3 border border-gray-100 h-64 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="absolute inset-x-3 inset-y-3 rounded-[2rem] overflow-hidden">
                                <iframe
                                    title="location-map"
                                    src="https://www.google.com/maps/place/Dubai/data=!4m2!3m1!1s0x3e5f43496ad9c645:0xbde66e5084295162?sa=X&ved=1t:242&ictx=111"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
