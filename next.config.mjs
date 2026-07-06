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

const nextConfig = {
  transpilePackages: ['@vigil/web-framework'], // framework ships TS source (docs/PUBLISHING.md)
  trailingSlash: false, // canonical = no trailing slash (matches SEO block + Page Health gate)
  async redirects() {
    return redirects;
  },
  // SEO-04 item 4 (SAFETY CRITICAL): noindex preview/dev ONLY. Mirrors the
  // ENV-01 VERCEL_ENV convention (lib/env-isolation.ts). Production
  // (VERCEL_ENV === 'production') MUST NEVER receive a noindex header, so we
  // emit the X-Robots-Tag header for every route iff we are NOT in production.
  async headers() {
    if (process.env.VERCEL_ENV === 'production') {
      return [];
    }
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
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

export default nextConfig;
