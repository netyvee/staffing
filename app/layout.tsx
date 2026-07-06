import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'], display: 'swap', variable: '--font-dm-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['500'], style: ['normal', 'italic'], display: 'swap', variable: '--font-playfair' });

export const metadata: Metadata = {
  metadataBase: new URL('https://staffing.vigilservices.co.uk'),
  title: { default: 'Vigil Care Staffing', template: '%s' },
  description: 'Healthcare assistants, support workers and care staffing across London.',
  // §0 deployment marker: lets anyone confirm which build serves the domain (this Next.js
  // enterprise build vs the legacy WordPress site). Checkable via: curl -s <url> | grep x-vigil-build
  other: { 'x-vigil-build': 'staffing-nextjs-enterprise', 'x-vigil-framework': '@vigil/web-framework@0.4.4' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${dmSans.variable} ${playfair.variable}`}>
      {/* vf-typography = opt-in shared type scale (framework tokens.css) */}
      <body className="vf-typography" style={{ background: '#0a1628', color: '#ffffff' }}>{children}</body>
    </html>
  );
}
