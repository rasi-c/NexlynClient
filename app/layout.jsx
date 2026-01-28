import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

const siteConfig = {
    name: "NEXLYN",
    description: "Discover a curated collection of premium products designed for modern living. Quality, innovation, and style at NEXLYN.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://nexlyn.com",
    ogImage: "/og-image.png",
};

export const metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: `${siteConfig.name} | Premium E-commerce Experience`,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: ["E-commerce", "Premium Products", "Modern Living", "Quality Goods"],
    authors: [{ name: "NEXLYN Team" }],
    creator: "NEXLYN",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: siteConfig.name,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
                <Toaster position="top-right" reverseOrder={false} />
                <Navbar />
                <div className="flex-grow">
                    {children}
                </div>
                <Footer />
            </body>
        </html>
    );
}
