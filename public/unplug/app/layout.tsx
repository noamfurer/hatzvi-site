import type { Metadata, Viewport } from 'next';
import '@fontsource/rubik/hebrew-400.css';
import '@fontsource/rubik/hebrew-500.css';
import '@fontsource/rubik/hebrew-700.css';
import '@fontsource/rubik/hebrew-800.css';
import '@fontsource/rubik/hebrew-900.css';
import '@fontsource/rubik/latin-400.css';
import '@fontsource/rubik/latin-700.css';
import '@fontsource/rubik/latin-900.css';
import './globals.css';
import { CONFIG } from '@/content/config';

const title = 'ארץ הצבי | נותנים לילדים לגדול';
const description =
  'לא צריך סמארטפון כדי להיות בקשר. מגלים למה כדאי לחכות עם הטלפון החכם, אילו חלופות קיימות ואיך עושים את זה ביחד, כקהילה.';

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.siteUrl),
  title,
  description,
  alternates: { canonical: CONFIG.siteUrl },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: CONFIG.siteUrl,
    siteName: 'ארץ הצבי',
    title,
    description,
    images: [{ url: `${CONFIG.siteUrl}og.jpg`, width: 1200, height: 630, alt: 'ארץ הצבי – יותר ילדות. פחות התראות.' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [`${CONFIG.siteUrl}og.jpg`] },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/img/logo-mark.png` },
};

export const viewport: Viewport = {
  themeColor: '#0E2547',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
