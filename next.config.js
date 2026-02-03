/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'img.youtube.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 's2.googleusercontent.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.google.com',
                pathname: '/**',
            }
        ],
    },
    // Other production-ready settings
    reactStrictMode: true,
    swcMinify: true,
};

module.exports = nextConfig;
