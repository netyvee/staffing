/** @type {import('next').NextConfig} */
import { withVigilSecurity } from '@vigil/web-framework/config/security.mjs';

// Gate 9 redirect map (generated from resources/web/staffing-redirects.json in netyvee/app).
// trailingSlash:false already auto-301s every `/x/`->`/x`; these cover the non-slug-clean
// cases: duplicate->canonical, slug renames (/our-services->/services, /about-...->/about),
// duplicate blog->canonical, thin PSL join->PSL page, capture->CRM funnel, retired->home.
const redirects = [
  { source: '/care-staffing-agency-london-2', destination: '/care-staffing-agency-london', permanent: true },
  { source: '/care-staffing-agency-in-london-2', destination: '/care-staffing-agency-london', permanent: true },
  { source: '/temporary-care-staffing-agency-southwark', destination: '/care-staffing-agency-in-southwark', permanent: true },
  { source: '/temporary-staffing-solutions-in-islington', destination: '/temporary-care-staffing-agency-in-islington', permanent: true },
  { source: '/our-services', destination: '/services', permanent: true },
  { source: '/about-care-staffing-agency-london', destination: '/about', permanent: true },
  { source: '/temporary-staffing-solutions-care', destination: '/temporary-staffing-solutions', permanent: true },
  { source: '/join-care-staffing-psl', destination: '/care-staffing-psl-partnership', permanent: true },
  { source: '/free-quote', destination: 'https://app.vigilservices.co.uk/enquire/staffing', permanent: true },
  { source: '/contact-care-agency', destination: 'https://app.vigilservices.co.uk/enquire/staffing', permanent: true },
  { source: '/newsletter-subscription', destination: '/', permanent: true },
  { source: '/subscribe', destination: '/', permanent: true },
  { source: '/thank-you-psl', destination: '/', permanent: true },
  { source: '/thank-you-quote', destination: '/', permanent: true },
  { source: '/thank-you-for-subscribing', destination: '/', permanent: true },
];

// Security headers (CSP + HSTS + X-Frame-Options + nosniff + Referrer/Permissions-Policy +
// X-DNS-Prefetch-Control) now come from the shared framework helper — one source for every
// Vigil site (EOS Q1.P2, web-framework ≥ v0.4.7). CSP is production-strict; dev-only
// 'unsafe-eval' for Next HMR is handled inside the helper. A strict nonce-based CSP remains a
// tracked follow-up. See @vigil/web-framework/config/security.mjs.
const nextConfig = {
  transpilePackages: ['@vigil/web-framework'], // framework ships TS source (docs/PUBLISHING.md)
  trailingSlash: false, // canonical = no trailing slash (matches SEO block + Page Health gate)
  async redirects() {
    return redirects;
  },
  // SEO-04 item 4 — Preview-noindex (SAFETY CRITICAL).
  // Vercel injects VERCEL_ENV = 'production' | 'preview' | 'development'. We emit
  // X-Robots-Tag: noindex, nofollow ONLY when the deploy is NON-production, so
  // preview/dev URLs are never indexed. PRODUCTION MUST NEVER be noindexed —
  // when VERCEL_ENV === 'production' we return an EMPTY header array.
  async headers() {
    if (process.env.VERCEL_ENV === 'production') return [];
    return [
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' }, // canonical image store
    ],
  },
};

export default withVigilSecurity(nextConfig);
