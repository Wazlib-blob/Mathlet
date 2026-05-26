import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/game',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src data:; connect-src 'none';",
          },
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'none'; script-src 'self' 'unsafe-inline' https://*.fillout.com; style-src 'unsafe-inline' https://fonts.googleapis.com https://*.fillout.com; font-src https://fonts.gstatic.com https://*.fillout.com; img-src data: https://*.fillout.com https:; frame-src https://*.fillout.com; connect-src https://*.fillout.com; worker-src blob:;",
          },
        ],
      },
    ]
  },
}

export default nextConfig
