const isStaticApp = process.env.STATICAPP_BACKEND_URL ? true : false;

console.log('color: ' + process.env.bgcolor)
module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    isStaticApp: isStaticApp,
    apiUrl:  process.env?.STATICAPP_BACKEND_URL ?  process.env.STATICAPP_BACKEND_URL : '/api',
    debug: `${process.env.DEBUG}`,
    description: `${process.env?.description ? process.env.description : ''}`,
    title: `${process.env?.title ? process.env.title : 'helpbuttons title'}`,
    adminemail: `${process.env?.adminemail ? process.env.adminemail : ''}`,
    bgcolor: `${process.env?.bgcolor ? process.env.bgcolor : 'red'}`,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  ...(!isStaticApp && {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.API_URL}/:path*`,
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
  }),
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { hostname: 'dummyimage.com' },
    ],
    ...(isStaticApp && { unoptimized: true }),
  },
  output: isStaticApp ? 'export' : 'standalone',
  sassOptions: {
    includePaths: [__dirname + '/styles'],
  },
};
