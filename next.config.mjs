/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      enabled: true
    },
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
