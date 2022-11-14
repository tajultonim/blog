/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },
  reactStrictMode: true,
  swcMinify: true,
  images: { domains: ["res.cloudinary.com"] },
};

module.exports = nextConfig;
