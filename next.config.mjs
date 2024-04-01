/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['127.0.0.1','api.earthie.in'], // Assuming an env var named NEXT_PUBLIC_IMAGE_DOMAIN
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
};

export default nextConfig;
