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
        buttonTypes: process.env.BUTTON_TYPES ? process.env.BUTTON_TYPES : '[{"name":"offer","caption":"Offer","color":"custom","cssColor":"#FFDD02"},{"name":"need","caption":"Need","color":"custom","cssColor":"#19AF96"},{"name":"service","caption":"Service","color":"custom","cssColor":"pink"}]',
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
