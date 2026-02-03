'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import Loading from '../../../components/Loading';
import ErrorMessage from '../../../components/ErrorMessage';
import { productAPI } from '../../../lib/api';
import { optimizeImage } from '../../../lib/imageUpload';

/**
 * Component to parse and display specifications in a structured table format
 * Format: Section headings followed by key-value pairs
 */
function SpecificationsTable({ content }) {
    const parseSpecifications = (text) => {
        const lines = text.split('\n').filter(line => line.trim());
        const sections = [];
        let currentSection = null;

        lines.forEach(line => {
            const trimmedLine = line.trim();

            // Check if this line is a section heading (no colon)
            if (!trimmedLine.includes(':') && trimmedLine.length > 0) {
                // This is a section heading
                if (currentSection && currentSection.items.length > 0) {
                    sections.push(currentSection);
                }
                currentSection = {
                    heading: trimmedLine,
                    items: []
                };
            } else if (trimmedLine.includes(':')) {
                // This is a key-value pair
                const colonIndex = trimmedLine.indexOf(':');
                const key = trimmedLine.substring(0, colonIndex).trim();
                const value = trimmedLine.substring(colonIndex + 1).trim();

                if (key && value) {
                    // If no section exists yet, create a default one
                    if (!currentSection) {
                        currentSection = {
                            heading: null,
                            items: []
                        };
                    }
                    currentSection.items.push({ key, value });
                }
            }
        });

        // Add the last section
        if (currentSection && currentSection.items.length > 0) {
            sections.push(currentSection);
        }

        return sections;
    };

    const sections = parseSpecifications(content);

    if (sections.length === 0) {
        return (
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {content}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {sections.map((section, sectionIdx) => (
                <div key={sectionIdx} className="overflow-hidden rounded-2xl border border-gray-200">
                    {/* Section Heading (if exists) */}
                    {section.heading && (
                        <div className="bg-gray-900 px-6 py-3">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">
                                {section.heading}
                            </h3>
                        </div>
                    )}

                    {/* Key-Value Table */}
                    <div className="divide-y divide-gray-200">
                        {section.items.map((item, idx) => (
                            <div
                                key={idx}
                                className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 py-4 px-6 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }`}
                            >
                                <div className="text-sm font-bold text-gray-800">
                                    {item.key}
                                </div>
                                <div className="text-sm text-gray-600 font-medium md:text-left">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}



export default function ProductClient({ id, initialProduct }) {
    const [product, setProduct] = useState(initialProduct);
    const [loading, setLoading] = useState(!initialProduct);
    const [activeImage, setActiveImage] = useState(initialProduct?.images?.[0] || null);
    const [activeTab, setActiveTab] = useState('description');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (initialProduct) return;
            try {
                const res = await productAPI.getById(id);
                setProduct(res.data);
                if (res.data.images && res.data.images.length > 0) {
                    setActiveImage(res.data.images[0]);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Product not found or an error occurred.');
            } finally {
                setLoading(false);
            }
        };

        if (id && !initialProduct) {
            fetchProduct();
        }
    }, [id, initialProduct]);

    const handleWhatsApp = () => {
        const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
        const message = encodeURIComponent(`Hi, I'm interested in the product: ${product.name}. Please provide more details and a quote.`);
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    if (error || !product) {
        return (
            <div className="min-h-screen pt-28">
                <ErrorMessage message={error || 'Product not found'} onRetry={() => window.location.reload()} />
            </div>
        );
    }

    const tabs = [
        { id: 'description', label: 'Detailed Description', content: product.detailedDescription },
        { id: 'specifications', label: 'Specifications', content: product.specifications },
        { id: 'applications', label: 'Applications', content: product.useCases }
    ];

    return (
        <div className="min-h-screen pt-28 pb-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Product Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                        {/* LEFT SIDE: Images */}
                        <div className="p-6 md:p-10 bg-white">
                            {/* Main Image */}
                            <div className="relative h-[300px] md:h-[450px] lg:h-[500px] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                                <Image
                                    src={optimizeImage(activeImage) || '/placeholder-product.png'}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-4 md:p-8"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>

                            {/* Thumbnails */}
                            {product.images && product.images.length > 1 && (
                                <div className="mt-6 grid grid-cols-4 gap-4">
                                    {product.images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(img)}
                                            className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-red-600 scale-105 shadow-md' : 'border-transparent hover:border-gray-200'
                                                }`}
                                        >
                                            <Image
                                                src={optimizeImage(img)}
                                                alt={`${product.name} thumb ${index}`}
                                                fill
                                                className="object-contain"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT SIDE: Product Info */}
                        <div className="p-6 md:p-10 bg-gray-50 flex flex-col justify-between">
                            <div className="space-y-6">
                                {/* Category */}
                                <span className="inline-block px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest">
                                    {product.category?.name || 'Uncategorized'}
                                </span>

                                {/* Product Name */}
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight">
                                    {product.name}
                                </h1>

                                {/* Price */}
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price</span>
                                    <span className="text-4xl font-black text-red-600">
                                        AED {product.price.toLocaleString('en-US')}
                                    </span>
                                </div>

                                {/* Short Description */}
                                <p className="text-gray-600 text-base leading-relaxed">
                                    {product.description}
                                </p>

                                {/* Stock Status */}
                                {product.inStock ? (
                                    <div className="flex items-center text-green-600 font-bold">
                                        <FaCheckCircle className="mr-2" />
                                        <span>In Stock</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-red-500 font-bold">
                                        <span>Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            {/* Quote Button */}
                            <button
                                onClick={handleWhatsApp}
                                className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-5 px-8 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 transition-all transform hover:scale-105 shadow-xl shadow-red-200"
                            >
                                <FaWhatsapp className="text-2xl" />
                                <span>Request Quote on WhatsApp</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabbed Content Section */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto scrollbar-hide">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 min-w-[150px] px-6 py-5 font-bold text-sm md:text-base transition-all ${activeTab === tab.id
                                        ? 'text-red-600 border-b-4 border-red-600 bg-red-50/50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 md:p-10">
                        {tabs.map((tab) => (
                            <div
                                key={tab.id}
                                className={`${activeTab === tab.id ? 'block' : 'hidden'}`}
                            >
                                {tab.content ? (
                                    <div className="prose prose-gray max-w-none">
                                        {tab.id === 'specifications' ? (
                                            <SpecificationsTable content={tab.content} />
                                        ) : (
                                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {tab.content}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">📝</div>
                                        <p className="text-gray-400 font-medium">
                                            No {tab.label.toLowerCase()} available for this product.
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
