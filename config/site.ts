// Vigil Care Staffing site NAVIGATION STRUCTURE + brand-asset references only.
// NAP (phone/email/address/trading_name) is NEVER here — it comes from the page JSON
// `nap` block (registry-sourced, staffing 020 3973 8887) so a wrong/cross-division
// number is impossible by construction. Brand assets are repo-static paths (site
// config/asset contract, W-STAFFING-FRAMEWORK-ADOPTION §11) — the future dashboard
// edits these values; the shared shell component reads them, never a literal.
import type { SiteNav } from '@vigil/web-framework';

export const siteNav: SiteNav = {
  brandName: 'Vigil Care Staffing',
  // Real approved Vigil Care Staffing logo (white-carded landscape wordmark) — public/logo-staffing.webp
  logo: { src: '/logo-staffing.webp', alt: 'Vigil Care Staffing', footerSrc: '/logo-staffing.webp' },
  primary: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Healthcare Assistants', href: '/healthcare-assistants' },
    { label: 'Support Workers', href: '/support-workers' },
    { label: 'Locations', href: '/locations' },
    { label: 'Careers', href: '/careers/staffing' },
    { label: 'Guides', href: '/blog' },
  ],
  footer: [
    {
      heading: 'Services',
      links: [
        { label: 'Healthcare Assistants', href: '/healthcare-assistants' },
        { label: 'Support Workers', href: '/support-workers' },
        { label: 'Healthcare Cleaners', href: '/healthcare-cleaners' },
        { label: 'Temporary Staffing', href: '/temporary-staffing-solutions-london' },
      ],
    },
    {
      heading: 'Careers',
      links: [
        { label: 'Careers hub', href: '/careers/staffing' },
        { label: 'Healthcare assistant jobs', href: '/healthcare-assistant-jobs' },
        { label: 'Colleague support', href: '/colleagues-support' },
        { label: 'Register your interest', href: 'https://app.vigilservices.co.uk/careers/staffing' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Locations', href: '/locations' },
        { label: 'Guides', href: '/blog' },
      ],
    },
  ],
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Modern Slavery Statement', href: '/modern-slavery-statement-2' },
    { label: 'Equal Opportunities', href: '/equal-opportunities-employer-policy' },
  ],
  companyReg: 'Company Reg. 11756806',
  enquiryCtaLabel: 'Request staffing support',
  // Recruitment/candidate pages route to the careers funnel, not client sales (the framework
  // Shell swaps the CTA when page_type === 'recruitment').
  careersCtaLabel: 'Careers & applications',
};
