/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

module.exports = {
    reactStrictMode: true,
    env: {
        mapifyApiKey: process.env.MAPIFY_API_KEY,
    },
    serverRuntimeConfig: {
        secret: process.env.JWT_SECRET
    },
    publicRuntimeConfig: {
        apiUrl: '/api/' // TODO: remove ME!
    },
    images: {
      domains: ['picsum.photos', 'dummyimage.com'],
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
            destination: `${process.env.API_URL ? process.env.API_URL : 'http://api:3001/' }:path*`
          },
        ]
    },
    async redirects() {
      return [
        {
          source: '/documentation',
          destination: (process.env.API_URL ? process.env.API_URL : 'http://api:3001/') + 'doc/',
          permanent: true,
        },
      ]
    },
    i18n
}
