import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPage, getPageSlugs, paramsToFile } from '@/lib/pages/loader';
import { RenderSections } from '@/components/sections/registry';
import { Header } from '@/components/shell/Header';
import { Footer } from '@/components/shell/Footer';
import { MobileCta } from '@/components/shell/MobileCta';

export const dynamicParams = false; // only committed pages exist; everything else 404s

export function generateStaticParams() {
  return getPageSlugs().map((f) => ({ slug: f === 'index' ? [] : f.split('__') }));
}

export function generateMetadata({ params }: { params: { slug?: string[] } }): Metadata {
  const page = getPage(paramsToFile(params.slug ?? []));
  if (!page) return {};
  const canonical = page.seo.canonical.replace(/\/$/, '') || '/';
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical },
    robots: page.seo.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: canonical,
      siteName: page.nap.trading_name,
      locale: 'en_GB',
      type: 'website',
      images: page.seo.og_image ? [{ url: page.seo.og_image }] : [],
    },
  };
}

export default function Page({ params }: { params: { slug?: string[] } }) {
  const page = getPage(paramsToFile(params.slug ?? []));
  if (!page) notFound();
  // The JSON content ALWAYS renders inside the shell (header/nav/footer/NAP/CTA).
  // A bare, shell-less page can no longer be produced by the engine.
  return (
    <div style={{ background: page.brand.bg, color: page.brand.text }} className="flex min-h-screen flex-col">
      <Header page={page} />
      <main className="flex-1">
        <RenderSections page={page} />
      </main>
      <Footer page={page} />
      <MobileCta page={page} />
    </div>
  );
}
