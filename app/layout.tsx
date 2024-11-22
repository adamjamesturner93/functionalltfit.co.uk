import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { SessionProvider } from 'next-auth/react';

import { ThemeProvider } from '@/components/theme-provider';
import { ThemeScript } from '@/components/theme-script';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://functionallyfit.com'),
  title: {
    default: 'FunctionallyFit | Adaptive Fitness for Every Body',
    template: '%s | FunctionallyFit',
  },
  description:
    'Tailored workouts and expert guidance for people with disabilities, long-term health conditions, busy parents, and time-strapped adults.',
  keywords: [
    'adaptive fitness',
    'personalised workouts',
    'disability fitness',
    'busy parent fitness',
    'health management',
  ],
  authors: [{ name: 'FunctionallyFit Team' }],
  creator: 'FunctionallyFit',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://functionallyfit.com',
    siteName: 'FunctionallyFit',
    title: 'FunctionallyFit | Adaptive Fitness for Every Body',
    description:
      'Tailored workouts and expert guidance for people with disabilities, long-term health conditions, busy parents, and time-strapped adults.',
    images: [
      {
        url: 'https://functionallyfit.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FunctionallyFit App Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FunctionallyFit | Adaptive Fitness for Every Body',
    description:
      'Tailored workouts and expert guidance for people with disabilities, long-term health conditions, busy parents, and time-strapped adults.',
    images: ['https://functionallyfit.com/twitter-image.jpg'],
    creator: '@FunctionallyFit',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <main>{children}</main>
          </SessionProvider>
        </ThemeProvider>
        <Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </body>
    </html>
  );
}
