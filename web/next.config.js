/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
module.exports = {
    reactStrictMode: true,
    env: {
        leafletTiles: process.env.LEAFLET_TILES,
        hostName: process.env.HOSTNAME,
        webPort: process.env.WEB_PORT,
        apiPort: process.env.API_PORT,
        mapifyApiKey: process.env.MAPIFY_API_KEY,
    },
    serverRuntimeConfig: {
        secret: process.env.JWT_SECRET
    },
    publicRuntimeConfig: {
        apiUrl: 'http://localhost:3001' // TODO: remove ME!
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
