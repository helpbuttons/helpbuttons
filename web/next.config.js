/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

module.exports = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        apiUrl: '/api'
    },
    typescript:{
        ignoreBuildErrors: true,
    },
    async rewrites() {
      return [{
        source: '/api/:path*',
        destination: `${process.env.API_URL}/:path*`
      },
      {
        source: '/manifest.json',
        destination: `${process.env.API_URL}/networks/manifest.json`
      },
      {
        source: '/rss',
        destination: `${process.env.API_URL}/buttons/rss`,
      },
      ]
    },
    async redirects() {
      return [
        {
          source: '/documentation',
          destination: `${process.env.API_URL}/doc/`,
          permanent: true,
        },
        {
          source: '/',
          destination: '/HomeInfo',
          permanent: true,
        },
      ]
    },
    images: {
      formats: ['image/avif', 'image/webp']
    },
    i18n,
    output: 'standalone',
}
