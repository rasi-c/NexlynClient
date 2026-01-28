/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
        ],
    },
    // Other production-ready settings
    reactStrictMode: true,
    swcMinify: true,
};

module.exports = nextConfig;
