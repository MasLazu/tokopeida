/** @type {import('next').NextConfig} */
const nextConfig = {
  server: {
    port: process.env.PORT || 3000,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.tokopedia.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.static-src.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'layanan.karangbaru.acehtamiangkab.go.id',
        port: '',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig
