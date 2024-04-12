/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

module.exports = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        apiUrl: process.env.API_URL
    },
    typescript:{
        ignoreBuildErrors: true,
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
        {
          source: '/Profile/:path*',
          destination: '/p/:path*',
          permanent: true
        }
      ]
    },
    images: {
      formats: ['image/avif', 'image/webp'],
    },
    i18n,
    output: 'standalone',
}
