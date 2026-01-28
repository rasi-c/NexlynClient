'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import Loading from '../../../components/Loading';
import ErrorMessage from '../../../components/ErrorMessage';
import { productAPI } from '../../../lib/api';
import { optimizeImage } from '../../../lib/imageUpload';

export default function ProductClient({ id, initialProduct }) {
    const [product, setProduct] = useState(initialProduct);
    const [loading, setLoading] = useState(!initialProduct);
    const [activeImage, setActiveImage] = useState(initialProduct?.images?.[0] || null);
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
                <ErrorMessage message={error || 'Product not found'} onRetry={() => window.location.href = '/'} />
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen pt-28 pb-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
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
                                                className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-blue-600 scale-105 shadow-md' : 'border-transparent hover:border-gray-200'
                                                    }`}
                                            >
                                                <Image
                                                    src={optimizeImage(img)}
                                                    alt={`${product.name} thumb ${index}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* RIGHT SIDE: Details */}
                            <div className="p-6 md:p-10 lg:border-l border-gray-100 flex flex-col">
                                {/* Header */}
                                <div className="mb-6">
                                    <span className="text-red-600 font-bold uppercase tracking-widest text-sm">
                                        {product.category?.name || 'Collection'}
                                    </span>
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4 tracking-tight leading-tight">
                                        {product.name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <span className="text-3xl md:text-4xl font-black text-red-600">
                                            ₹{product.price.toLocaleString('en-IN')}
                                        </span>
                                        {product.inStock ? (
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                                                <FaCheckCircle className="mr-1" /> In Stock
                                            </span>
                                        ) : (
                                            <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Key Features */}
                                {product.keyFeatures && product.keyFeatures.length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">Key Features</h3>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {product.keyFeatures.map((feature, index) => (
                                                <li key={index} className="flex items-center text-gray-600 text-sm">
                                                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-3"></div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Specifications Table */}
                                {product.specifications && product.specifications.length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">Specifications</h3>
                                        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                            <table className="w-full text-sm text-left">
                                                <tbody>
                                                    {product.specifications.map((spec, index) => (
                                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                            <td className="px-5 py-3 font-bold text-gray-700 border-r border-gray-100 w-1/3 italic">
                                                                {spec.label}
                                                            </td>
                                                            <td className="px-5 py-3 text-gray-600">
                                                                {spec.value}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Action Button */}
                                <div className="mt-auto">
                                    <button
                                        onClick={handleWhatsApp}
                                        disabled={!product.inStock}
                                        className={`w-full py-4 md:py-6 rounded-2xl flex items-center justify-center space-x-3 text-white font-black text-lg md:text-xl shadow-xl transition-all transform active:scale-95 ${product.inStock
                                            ? 'bg-green-600 hover:bg-green-700 shadow-green-200'
                                            : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <FaWhatsapp className="text-2xl md:text-3xl" />
                                        <span>Get Quote on WhatsApp</span>
                                    </button>
                                    <p className="text-center text-xs text-gray-400 mt-4 font-medium">
                                        Free consultation and bulk pricing available.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Structured Data (JSON-LD) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        "name": product.name,
                        "image": product.images,
                        "description": product.description,
                        "sku": product._id,
                        "brand": {
                            "@type": "Brand",
                            "name": "NEXLYN"
                        },
                        "offers": {
                            "@type": "Offer",
                            "url": `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product._id}`,
                            "priceCurrency": "INR",
                            "price": product.price,
                            "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                        }
                    })
                }}
            />
        </>
    );
}
