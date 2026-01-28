'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { optimizeImage } from '../lib/imageUpload';

/**
 * Modern Category Card Component
 * @param {Object} props - Component props
 * @param {Object} props.category - The category data object
 */
const CategoryCard = ({ category }) => {
    if (!category) return null;

    return (
        <Link href={`/category/${category._id}`}>
            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100">
                {/* Category Image */}
                <div className="relative h-48 w-full overflow-hidden">
                    <Image
                        src={optimizeImage(category.image) || '/placeholder-category.png'}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {/* Subtle Overlay to ensure text readability if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Category Info */}
                <div className="p-4 bg-white border-t border-gray-50 text-center">
                    <h3 className="text-gray-800 font-bold text-base md:text-lg group-hover:text-red-600 transition-colors duration-300">
                        {category.name}
                    </h3>
                    <p className="text-red-600 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        View Collection
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;
