const isTauri = process.env.TAURI_BUILD === 'true';

module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },
  publicRuntimeConfig: {
    apiUrl: '/api',
    debug: `${process.env.DEBUG}`,
    description: `${process.env?.description ? process.env.description : ''}`,
    title: `${process.env?.title ? process.env.title : ''}`,
    adminemail: `${process.env?.adminemail ? process.env.adminemail : ''}`,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  ...(!isTauri && {
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
    ...(isTauri && { unoptimized: true }),
  },
  output: isTauri ? 'export' : 'standalone',
  sassOptions: {
    includePaths: [__dirname + '/styles'],
  },
};
