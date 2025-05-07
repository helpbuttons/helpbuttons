/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    apiUrl: '/api',
    debug: `${process.env.DEBUG}`
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/:path*`,
      },
      {
        source: '/.well-known/:path*',
        destination: `${process.env.API_URL}/.well-known/:path*`,
        // has: [
        //   {
        //     type: 'header',
        //     key: 'Accept',
        //     value: 'application/activity+json'
        //   }
        // ],
      },
      {
        source: '/manifest.json',
        destination: `${process.env.API_URL}/networks/manifest.json`,
      },
      {
        source: '/rss',
        destination: `${process.env.API_URL}/buttons/rss`,
      }
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  i18n,
  output: 'standalone',
  sassOptions: {
    includePaths: [__dirname + '/styles'],
  },
};
