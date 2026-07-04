/** @type {import('next').NextConfig} */

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

// WS-G security headers. CSP allows 'unsafe-inline' for style/script because the framework
// renders with inline `style={}` and Next injects inline hydration bootstrap; a strict
// nonce-based CSP is a larger follow-up (tracked). img allows the canonical Cloudinary store.
// Next DEV uses eval() for Fast Refresh/HMR, so 'unsafe-eval' is required in development
// only. Production (`next build`/`next start`) never evals — its CSP stays strict.
const scriptSrc = process.env.NODE_ENV === 'production'
  ? "script-src 'self' 'unsafe-inline'"
  : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https://res.cloudinary.com data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://app.vigilservices.co.uk",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig = {
  transpilePackages: ['@vigil/web-framework'], // framework ships TS source (docs/PUBLISHING.md)
  trailingSlash: false, // canonical = no trailing slash (matches SEO block + Page Health gate)
  async redirects() {
    return redirects;
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' }, // canonical image store
    ],
  },
};

export default nextConfig;
