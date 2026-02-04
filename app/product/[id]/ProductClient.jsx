'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaWhatsapp, FaCheckCircle, FaYoutube, FaFilePdf, FaExternalLinkAlt } from 'react-icons/fa';
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
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPos({ x, y });
    };

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
        { id: 'documents', label: 'Documents', content: product.useCases }
    ];

    const getYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/|w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="min-h-screen pt-28 pb-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Product Section (Flatter) */}
                <div className="mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* LEFT SIDE: Images */}
                        <div className="bg-white rounded-[2.5rem] p-4 md:p-6 border border-gray-100 shadow-sm">
                            {/* Main Image */}
                            <div
                                className="relative h-[350px] md:h-[500px] lg:h-[550px] w-full rounded-3xl overflow-hidden bg-gray-50 shadow-inner cursor-zoom-in"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <div
                                    className="relative w-full h-full transition-transform duration-200 ease-out"
                                    style={{
                                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                        transform: isHovered ? 'scale(2.2)' : 'scale(1)'
                                    }}
                                >
                                    <Image
                                        src={optimizeImage(activeImage) || '/placeholder-product.png'}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-4 md:p-8"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
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
                        <div className="flex flex-col justify-center py-4 lg:py-8 lg:px-4">
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
                                        ${product.price.toLocaleString('en-US')}
                                    </span>
                                </div>

                                {/* Short Description */}
                                <p className="text-gray-600 text-base leading-relaxed break-words overflow-hidden">
                                    {product.description}
                                </p>

                                {/* Key Features Quick List */}
                                {product.keyFeatures && product.keyFeatures.length > 0 && (
                                    <ul className="space-y-2.5 pt-2">
                                        {product.keyFeatures.map((feature, idx) => (
                                            <li key={idx} className="flex items-start text-sm font-bold text-gray-700">
                                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-3 shrink-0 mt-2"></div>
                                                <span className="break-words">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

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
                                className="mt-10 w-full bg-red-600 hover:bg-red-700 text-white py-5 px-8 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] shadow-xl shadow-red-200"
                            >
                                <FaWhatsapp className="text-2xl" />
                                <span>Request Quote on WhatsApp</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabbed Content Section (Flatter) */}
                <div className="pt-10 border-t border-gray-200">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto scrollbar-hide">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 min-w-[150px] px-6 py-6 font-bold text-sm md:text-base transition-all relative ${activeTab === tab.id
                                        ? 'text-red-600'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-full" />
                                    )}
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
                                {tab.id === 'documents' ? (
                                    <div className="space-y-10">
                                        {/* Use Cases / Application Text */}
                                        {product.useCases && (
                                            <div className="prose prose-gray max-w-none">
                                                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                                    {product.useCases}
                                                </div>
                                            </div>
                                        )}

                                        {/* Links Section */}
                                        {(product.youtubeLink || product.pdfLink) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                                                {/* YouTube Link */}
                                                {product.youtubeLink && (
                                                    <a
                                                        href={product.youtubeLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group relative block overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1"
                                                    >
                                                        <div className="relative aspect-video w-full bg-black">
                                                            {getYoutubeId(product.youtubeLink) ? (
                                                                <>
                                                                    <Image
                                                                        src={`https://img.youtube.com/vi/${getYoutubeId(product.youtubeLink)}/maxresdefault.jpg`}
                                                                        alt="Video Thumbnail"
                                                                        fill
                                                                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                                                                            <FaYoutube className="text-white text-3xl" />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-600">
                                                                    <FaYoutube className="text-6xl mb-2" />
                                                                    <span className="font-bold uppercase tracking-widest text-xs">Watch Video</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="p-4 flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-bold text-gray-900">Product Video Guide</h4>
                                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Watch on YouTube</p>
                                                            </div>
                                                            <FaExternalLinkAlt className="text-gray-300 group-hover:text-red-600 transition-colors" />
                                                        </div>
                                                    </a>
                                                )}

                                                {/* PDF Link */}
                                                {product.pdfLink && (
                                                    <a
                                                        href={product.pdfLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group relative block overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1"
                                                    >
                                                        <div className="relative aspect-video w-full bg-white flex items-center justify-center overflow-hidden">
                                                            <div className="absolute inset-0 bg-gray-50 flex flex-col p-4 opacity-40 group-hover:opacity-60 transition-opacity">
                                                                <div className="w-full h-4 bg-gray-300 rounded-sm mb-2"></div>
                                                                <div className="w-2/3 h-3 bg-gray-200 rounded-sm mb-4"></div>
                                                                <div className="grid grid-cols-2 gap-2 mb-4">
                                                                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                                                                    <div className="h-16 bg-gray-200 rounded-lg"></div>
                                                                </div>
                                                                <div className="w-full h-2 bg-gray-200 rounded-sm mb-1"></div>
                                                                <div className="w-full h-2 bg-gray-200 rounded-sm mb-1"></div>
                                                                <div className="w-3/4 h-2 bg-gray-200 rounded-sm"></div>
                                                            </div>

                                                            <div className="relative z-10 text-center transform group-hover:scale-110 transition-transform duration-500">
                                                                <div className="relative inline-block">
                                                                    <FaFilePdf className="text-7xl text-red-600 drop-shadow-lg" />
                                                                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
                                                                        <img
                                                                            src={`https://www.google.com/s2/favicons?domain=mikrotik.com&sz=32`}
                                                                            alt="Mikrotik"
                                                                            className="w-4 h-4 rounded-full"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <span className="block font-black text-gray-900 uppercase tracking-widest text-[10px] mt-3">Tech Datasheet</span>
                                                            </div>

                                                            <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-colors flex items-center justify-center">
                                                                <div className="bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                                                                    View Document
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-4 flex items-center justify-between bg-white border-t border-gray-50">
                                                            <div>
                                                                <h4 className="font-bold text-gray-900">Technical Datasheet</h4>
                                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Mikrotik Official Link</p>
                                                            </div>
                                                            <FaExternalLinkAlt className="text-gray-300 group-hover:text-red-600 transition-colors" />
                                                        </div>
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        {!product.useCases && !product.youtubeLink && !product.pdfLink && (
                                            <div className="text-center py-12">
                                                <div className="text-6xl mb-4">📝</div>
                                                <p className="text-gray-400 font-medium">
                                                    No documents available for this product.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {tab.content ? (
                                            <div className="prose prose-gray max-w-none text-gray-700">
                                                {tab.id === 'specifications' ? (
                                                    <SpecificationsTable content={tab.content} />
                                                ) : (
                                                    <div className="leading-relaxed whitespace-pre-wrap break-words">
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
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
