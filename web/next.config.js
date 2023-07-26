/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

module.exports = {
    reactStrictMode: true,
    // env: {
    //     mapifyApiKey: process.env.MAPIFY_API_KEY,
    // },
    // serverRuntimeConfig: {
    //     secret: process.env.JWT_SECRET
    // },
    publicRuntimeConfig: {
        apiUrl: '/api/',
    },
    typescript:{
        ignoreBuildErrors: true,
    },
    rewrites: async () => {
        return [
          {
            source: '/geoapify/:path*',
            destination: 'https://api.geoapify.com/:path*',
          },
          {
            source: '/api/:path*',
            destination: `${process.env.API_URL}/:path*`
          },
          {
            source: '/opencage/:path*',
            destination: 'https://api.opencagedata.com/geocode/v1/:path*',
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
    i18n
}
