/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
module.exports = {
    reactStrictMode: true,
    env: {
        leafletTiles: process.env.LEAFLET_TILES,
        backendUri: process.env.BACKEND_URI,
        mapifyApiKey: process.env.MAPIFY_API_KEY,
        frontendUri: process.env.FRONTEND_URI
    },
    serverRuntimeConfig: {
        secret: process.env.JWT_SECRET
    },
    publicRuntimeConfig: {
        apiUrl: process.env.BACKEND_URI
    },
    images: {
      domains: ['dummyimage.com', 'picsum.photos', 'localhost'],
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
        ]
    },
    i18n
}
