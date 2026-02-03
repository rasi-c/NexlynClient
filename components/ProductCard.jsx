'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { optimizeImage } from '../lib/imageUpload';

/**
 * Professional Product Card Component
 * @param {Object} props - Component props
 * @param {Object} props.product - The product data object
 */
const ProductCard = ({ product }) => {
    if (!product) return null;

    // Use the first image from the array, or a placeholder if none exists
    const mainImage = product.images && product.images.length > 0
        ? optimizeImage(product.images[0])
        : '/placeholder-product.png';

    return (
        <Link href={`/product/${product._id}`}>
            <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                {/* Product Image Container */}
                <div className="relative h-64 w-full overflow-hidden">
                    <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Availability Badge */}
                    {!product.inStock && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Out of Stock
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="p-5 flex flex-col flex-grow">
                    {/* Category Tag */}
                    <span className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">
                        {product.category?.name || 'Uncategorized'}
                    </span>

                    {/* Product Name */}
                    <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
                        {product.name}
                    </h3>

                    {/* Brief Description */}
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                        {product.description}
                    </p>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                            <span className="text-gray-400 text-xs uppercase font-medium">Price</span>
                            <span className="text-red-600 font-extrabold text-xl">
                                ${product.price.toLocaleString('en-US')}
                            </span>
                        </div>

                        <button className="bg-gray-100 group-hover:bg-red-600 group-hover:text-white p-2 rounded-lg transition-colors duration-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
