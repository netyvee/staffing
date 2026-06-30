import type { PageJson } from '@/lib/pages/loader';

// Sticky mobile enquiry CTA -> the registry enquiry URL.
export function MobileCta({ page }: { page: PageJson }) {
  return (
    <a href={page.nap.enquiry_url}
       style={{ background: page.brand.cta, color: page.brand.bg }}
       className="fixed inset-x-3 bottom-3 z-50 rounded-lg px-5 py-3 text-center text-sm font-medium shadow-lg md:hidden">
      Request care support · {page.nap.phone}
    </a>
  );
}
