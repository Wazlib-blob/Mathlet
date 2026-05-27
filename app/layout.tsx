import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const SITE_URL = 'https://nerdlygames.org'

export const metadata: Metadata = {
  title: {
    template: '%s | Nerdly',
    default: 'Nerdly — Free Maths Games for Singapore Secondary School Students',
  },
  description: 'Free interactive maths games for Singapore secondary school students. A fun alternative to maths tuition — practice O-level E-math and A-math topics: linear functions, quadratic equations, graph sketching and more. No sign-up needed.',
  keywords: [
    'Singapore maths games', 'free maths games Singapore', 'interactive maths Singapore',
    'Singapore maths tuition', 'SG maths tuition', 'Singapore math tuition',
    'Singapore tutor', 'SG tutor', 'Singapore tuition teacher', 'SG tuition teacher',
    'maths tuition alternative Singapore', 'free tuition Singapore',
    'Singapore secondary school maths', 'SG secondary school maths',
    'sec school maths Singapore', 'secondary school maths worksheets Singapore',
    'SG sec sch maths', 'sec 1 maths', 'sec 2 maths', 'sec 3 maths', 'sec 4 maths',
    'O level maths', 'O level maths practice', 'O level E-math', 'O level A-math',
    'E-math Singapore', 'A-math Singapore',
    'Singapore maths worksheets', 'SG maths worksheets', 'maths revision Singapore',
    'free maths worksheets Singapore', 'maths practice Singapore',
    'linear equations Singapore', 'quadratic equations Singapore', 'graph sketching',
    'gradient and y-intercept', 'exponential functions maths',
  ],
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: SITE_URL,
    siteName: 'Nerdly',
    title: 'Nerdly — Free Maths Games for Singapore Secondary School',
    description: 'A fun alternative to maths tuition for Singapore secondary school students. Practice O-level E-math and A-math through interactive games. Free, no sign-up.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nerdly — Free Maths Games for Singapore Secondary School',
    description: 'Practice O-level maths through interactive games. Free alternative to maths tuition. No sign-up.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
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
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'EducationalApplication',
                name: 'Nerdly',
                alternateName: ['Nerdly Maths', 'Nerdly Games'],
                url: `${SITE_URL}/`,
                description: 'Free interactive maths games for Singapore secondary school students. A fun alternative to maths tuition covering O-level E-math and A-math topics.',
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'Web Browser',
                educationalUse: ['practice', 'selfAssessment', 'instruction'],
                educationalLevel: 'Secondary',
                typicalAgeRange: '13-17',
                isAccessibleForFree: true,
                inLanguage: 'en-SG',
                countryOfOrigin: 'SG',
                audience: {
                  '@type': 'EducationalAudience',
                  educationalRole: 'student',
                  audienceType: 'Singapore Secondary School Students',
                  geographicArea: { '@type': 'Country', name: 'Singapore' },
                },
                about: {
                  '@type': 'Thing',
                  name: 'O-level Mathematics',
                  description: 'Singapore O-level E-math and A-math: linear functions, quadratic equations, factored form, power functions, exponential functions, graph sketching',
                },
                teaches: [
                  'Linear equations and gradient (Sec 1–2 E-math)',
                  'Quadratic functions and graph sketching (Sec 3–4 E-math)',
                  'Factored form of quadratic equations (Sec 3–4 A-math)',
                  'Power and polynomial functions (Sec 3–4 A-math)',
                  'Exponential functions (Sec 3–4 A-math)',
                ],
                keywords: 'Singapore maths tuition, O level maths, secondary school maths, E-math, A-math, maths worksheets Singapore, sec school maths, Singapore tutor',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'SGD', availability: 'https://schema.org/InStock' },
                provider: { '@type': 'Organization', name: 'Nerdly', url: `${SITE_URL}/` },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Nerdly',
                url: `${SITE_URL}/`,
                description: 'Free maths games for Singapore secondary school students — a fun alternative to maths tuition.',
                inLanguage: 'en-SG',
              },
            ]),
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
