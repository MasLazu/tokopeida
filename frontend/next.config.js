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
        ],
    },
}

module.exports = nextConfig
