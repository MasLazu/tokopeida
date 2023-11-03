/** @type {import('next').NextConfig} */
const nextConfig = {
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
          }
        ],
    },
}

module.exports = nextConfig
