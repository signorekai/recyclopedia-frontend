/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['recyclopedia.ap-south-1.linodeobjects.com'],
  },
  async redirects() {
    return [
      {
        source: '/donate/:slug',
        destination: '/resources/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
