/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/learn',
        destination: '/articles',
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
  images: {
    domains: ['recyclopedia.ap-south-1.linodeobjects.com'],
  },
};

module.exports = nextConfig;
