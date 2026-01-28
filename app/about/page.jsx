'use client';

import React from 'react';
import { FaAward, FaUsers, FaHistory, FaLightbulb } from 'react-icons/fa';

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-28 pb-20 bg-white">
            {/* Hero Section */}
            <section className="relative py-20 bg-gray-900 text-white overflow-hidden mb-20">
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-transparent"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
                            Our Journey to <span className="text-red-500">Reliable Connectivity</span>
                        </h1>
                        <p className="text-xl text-gray-300 leading-relaxed mb-8">
                            NEXLYN was founded with a clear goal: to deliver professional-grade
                            networking solutions that businesses, ISPs, and home users can trust.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Mission & Vision */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
                    <div className="bg-red-50 p-10 md:p-16 rounded-[3rem] border border-red-100 relative overflow-hidden group">
                        <FaLightbulb className="text-6xl text-red-100 absolute -top-4 -right-4 transition-transform group-hover:scale-125 duration-700" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            To provide genuine, high-performance networking products that enable
                            stable, secure, and scalable connectivity. We focus on delivering
                            original MikroTik solutions backed by expert guidance and dependable support.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-10 md:p-16 rounded-[3rem] border border-gray-100 relative overflow-hidden group">
                        <FaAward className="text-6xl text-gray-200 absolute -top-4 -right-4 transition-transform group-hover:scale-125 duration-700" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            To become a trusted regional leader in networking distribution,
                            recognized for authenticity, technical expertise, and long-term
                            customer partnerships across enterprise and ISP markets.
                        </p>
                    </div>
                </section>

                {/* Company History */}
                <section className="flex flex-col lg:flex-row items-center gap-16 mb-32">
                    <div className="lg:w-1/2">
                        <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-red-600/10 z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"
                                alt="NEXLYN Office"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="lg:w-1/2">
                        <div className="flex items-center space-x-3 text-red-600 font-bold uppercase tracking-widest text-sm mb-4">
                            <FaHistory />
                            <span>Founded in 2026</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
                            How we started...
                        </h2>
                        <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                            <p>
                                NEXLYN began as a focused networking supply business with a mission
                                to make genuine MikroTik products easily accessible to professionals,
                                system integrators, and growing companies.
                            </p>
                            <p>
                                Today, we support businesses, ISPs, and individual users with a
                                carefully selected range of routers, switches, and wireless solutions—
                                always prioritizing reliability, authenticity, and technical accuracy.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Core Values / Stats */}
                <section className="bg-gray-900 rounded-[4rem] p-12 md:p-20 text-white shadow-2xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter">
                            Small Team, Strong Networks
                        </h2>
                        <p className="text-gray-400 text-lg">
                            The principles that define how we work and serve.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { icon: FaUsers, title: "Trusted", desc: "Business & ISP Clients" },
                            { icon: FaAward, title: "100%", desc: "Genuine Products" },
                            { icon: FaHistory, title: "Fast", desc: "Order Fulfillment" },
                            { icon: FaLightbulb, title: "Expert", desc: "Technical Support" },
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center space-y-4">
                                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <stat.icon className="text-2xl" />
                                </div>
                                <h4 className="text-3xl font-black">{stat.title}</h4>
                                <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">
                                    {stat.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}
