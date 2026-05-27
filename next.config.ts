import type { NextConfig } from 'next'

// Security headers applied to every route
const GLOBAL_SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: GLOBAL_SECURITY_HEADERS,
      },
      {
        source: '/game',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'none'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data:",
              "connect-src 'self' https://vitals.vercel-insights.com",
            ].join('; '),
          },
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'none'",
              "script-src 'self' 'unsafe-inline' https://*.fillout.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.fillout.com",
              "font-src 'self' https://fonts.gstatic.com https://*.fillout.com",
              "img-src 'self' data: https://*.fillout.com",
              "frame-src https://*.fillout.com",
              "connect-src 'self' https://*.fillout.com https://vitals.vercel-insights.com",
              "worker-src blob:",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
