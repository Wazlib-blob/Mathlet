import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Nerdly',
    default: 'Nerdly — Free Maths Games for Singapore Secondary School Students',
  },
  description: 'Free interactive maths games for Singapore secondary school students. Practice O-level topics: linear functions, quadratic equations, graph sketching and more. No sign-up needed.',
  keywords: ['Singapore maths games', 'O level maths', 'secondary school maths', 'free maths practice', 'graph sketching game', 'linear equations', 'quadratic equations', 'E-math', 'A-math', 'maths tuition alternative', 'Singapore secondary school', 'maths revision Singapore'],
  metadataBase: new URL('https://mathlet-ten.vercel.app'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: 'https://mathlet-ten.vercel.app',
    siteName: 'Nerdly',
    title: 'Nerdly — Free Maths Games for Singapore Secondary School',
    description: 'Free interactive maths games for Singapore secondary school students. Practice O-level topics: linear functions, quadratic equations, graph sketching and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nerdly — Free Maths Games for Singapore Secondary School',
    description: 'Practice O-level maths through interactive games. Free, no sign-up.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-SG">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Nunito+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalApplication',
              name: 'Nerdly',
              url: 'https://mathlet-ten.vercel.app/',
              description: 'Interactive maths games for Singapore secondary school students covering O-level topics including linear functions, quadratic equations, graph sketching, power and exponential functions.',
              applicationCategory: 'EducationalApplication',
              educationalUse: ['practice', 'selfAssessment'],
              educationalLevel: 'Secondary',
              typicalAgeRange: '13-17',
              isAccessibleForFree: true,
              inLanguage: 'en-SG',
              audience: {
                '@type': 'EducationalAudience',
                educationalRole: 'student',
                audienceType: 'Secondary School Students',
              },
              about: {
                '@type': 'Thing',
                name: 'O-level Mathematics',
                description: 'Singapore O-level maths topics: linear functions, quadratic equations, factored form, power functions, exponential functions, graph sketching',
              },
              teaches: [
                'Linear equations and gradient',
                'Quadratic functions and graph sketching',
                'Factored form of quadratic equations',
                'Power functions',
                'Exponential functions',
              ],
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'SGD' },
              provider: { '@type': 'Organization', name: 'Nerdly', url: 'https://mathlet-ten.vercel.app/' },
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
