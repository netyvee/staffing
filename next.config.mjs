/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false, // canonical = no trailing slash (matches SEO block + Page Health gate)
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' }, // canonical image store
    ],
  },
};

export default nextConfig;
