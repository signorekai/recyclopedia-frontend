const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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
    domains: [
      'cdn.recyclopedia.sg',
      'recyclopedia.ap-south-1.linodeobjects.com',
    ],
    minimumCacheTTL: 172800, // 2 days
  },
};

module.exports = withBundleAnalyzer(nextConfig);
