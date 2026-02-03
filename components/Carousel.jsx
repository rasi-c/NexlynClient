'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { optimizeImage } from '../lib/imageUpload';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import required modules
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';

/**
 * Modern Banner Carousel Component (Split Layout)
 * Features a blurred background, left-side product image, and right-side text.
 */
const Carousel = ({ banners = [] }) => {
    if (!banners || banners.length === 0) return null;

    return (
        <div className="w-full relative group bg-gray-900 overflow-hidden">
            <Swiper
                effect={'fade'}
                spaceBetween={0}
                centeredSlides={true}
                /* autoplay={{
                    delay: 5000,
                    disableOnInteraction: false, 
                    pauseOnMouseEnter: true
                }} */
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={true}
                loop={true}
                modules={[Autoplay, EffectFade, Pagination, Navigation]}
                className="mySwiper h-[750px] md:h-[650px] w-full"
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={banner._id || index} className="relative w-full h-full">
                        {/* 1. Background Layer */}
                        <div className="absolute inset-0 z-0 bg-gray-900">
                            {/* Background Image (Visible, No Blur) */}
                            <Image
                                src={optimizeImage(banner.backgroundImage || banner.image)}
                                alt="Background"
                                fill
                                className={`object-cover ${banner.backgroundImage ? 'opacity-100' : 'opacity-100'}`}
                                priority={index === 0}
                            />

                            {/* Tech Grid Pattern Overlay (CSS) */}
                            <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
                                    backgroundSize: '30px 30px'
                                }}
                            ></div>

                            {/* Gradient Overlay for Readability */}
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900/60 to-gray-900/40"></div>
                        </div>

                        {/* 2. Content Container */}
                        <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-center h-full pb-12 md:pb-0 pt-24 md:pt-0">

                                {/* Left Side: Product Image */}
                                <div className="order-1 md:order-1 relative h-[250px] md:h-[450px] w-full flex items-center justify-center">
                                    <div className="relative w-full h-full animate-float">
                                        <Image
                                            src={optimizeImage(banner.image)}
                                            alt={banner.title}
                                            fill
                                            className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500"
                                            priority={index === 0}
                                        />
                                    </div>
                                </div>

                                {/* Right Side: Text Content */}
                                <div className="order-2 md:order-2 flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-4 md:space-y-6">
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-red-600/20 text-red-400 font-bold text-xs md:text-sm tracking-widest uppercase border border-red-600/30 backdrop-blur-sm animate-fade-in-up">
                                        Premium Collection
                                    </span>

                                    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight animate-fade-in-up delay-100 drop-shadow-lg">
                                        {banner.title}
                                    </h2>

                                    <p className="text-gray-300 text-base md:text-lg max-w-lg leading-relaxed animate-fade-in-up delay-200">
                                        Experience superior performance with our latest networking solutions.
                                        Genuine products backed by expert support.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up delay-300 w-full md:w-auto">
                                        <Link
                                            href={banner.link || '/products'}
                                            className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 transform hover:-translate-y-1 flex items-center justify-center"
                                        >
                                            Shop Now
                                        </Link>
                                        <Link
                                            href="/contact"
                                            className="px-8 py-4 bg-transparent border-2 border-white/20 text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-white hover:text-gray-900 transition-all transform hover:-translate-y-1 flex items-center justify-center backdrop-blur-sm"
                                        >
                                            Contact Sales
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Global Styles for Animations & Overrides */}
            <style jsx global>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                    opacity: 0;
                }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }

                /* Swiper Overrides */
                .swiper-button-next,
                .swiper-button-prev {
                    color: white !important;
                    background: rgba(255, 255, 255, 0.1);
                    width: 50px !important;
                    height: 50px !important;
                    border-radius: 50%;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .swiper-button-next:after,
                .swiper-button-prev:after {
                    font-size: 20px !important;
                    font-weight: bold;
                }
                .swiper-button-next:hover,
                .swiper-button-prev:hover {
                    background: #dc2626 !important;
                    border-color: #dc2626;
                }
                .swiper-pagination-bullet {
                    background: rgba(255,255,255,0.5) !important;
                }
                .swiper-pagination-bullet-active {
                    background: #dc2626 !important;
                    width: 30px !important;
                    border-radius: 4px !important;
                }
            `}</style>
        </div>
    );
};

export default Carousel;
