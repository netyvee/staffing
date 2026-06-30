import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://staffing.vigilservices.co.uk'),
  title: { default: 'Vigil Care Staffing', template: '%s' },
  description: 'Healthcare assistants, support workers and care staffing across London.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body style={{ background: '#0a1628', color: '#ffffff' }}>{children}</body>
    </html>
  );
}
