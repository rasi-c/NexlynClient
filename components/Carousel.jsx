'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { optimizeImage } from '../lib/imageUpload';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import required modules
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

/**
 * Modern Banner Carousel Component
 * @param {Object} props - Component props
 * @param {Array} props.banners - Array of banner objects
 */
const Carousel = ({ banners = [] }) => {
    if (!banners || banners.length === 0) return null;

    return (
        <div className="w-full relative group">
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper h-[400px] md:h-[500px] w-full"
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={banner._id || index} className="relative overflow-hidden">
                        {banner.link ? (
                            <Link href={banner.link}>
                                <div className="w-full h-full relative">
                                    <Image
                                        src={optimizeImage(banner.image)}
                                        alt={banner.title || "Banner"}
                                        fill
                                        priority={index === 0}
                                        className="object-cover"
                                        sizes="100vw"
                                    />
                                    {banner.title && (
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 md:p-12">
                                            <div className="max-w-7xl mx-auto">
                                                <h2 className="text-white text-2xl md:text-4xl font-bold tracking-tight transform translate-y-0 opacity-100 transition-all duration-500">
                                                    {banner.title}
                                                </h2>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ) : (
                            <div className="w-full h-full relative">
                                <Image
                                    src={optimizeImage(banner.image)}
                                    alt={banner.title || "Banner"}
                                    fill
                                    priority={index === 0}
                                    className="object-cover"
                                    sizes="100vw"
                                />
                                {banner.title && (
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 md:p-12">
                                        <div className="max-w-7xl mx-auto">
                                            <h2 className="text-white text-2xl md:text-4xl font-bold tracking-tight">
                                                {banner.title}
                                            </h2>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom styles to override Swiper defaults for a premium look */}
            <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
          background: rgba(0, 0, 0, 0.2);
          width: 50px !important;
          height: 50px !important;
          border-radius: 50%;
          backdrop-filter: blur(4px);
          transition: all 0.3s ease;
          opacity: 0;
        }
        
        .group:hover .swiper-button-next,
        .group:hover .swiper-button-prev {
          opacity: 1;
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px !important;
          font-weight: bold;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(220, 38, 38, 0.8) !important;
        }

        .swiper-pagination-bullet-active {
          background: #dc2626 !important;
          width: 24px !important;
          border-radius: 4px !important;
        }
      `}</style>
        </div>
    );
};

export default Carousel;
