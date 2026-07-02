import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getPage,
  getPageSlugs,
  paramsToFile,
  buildPageMetadata,
  RenderSections,
  Shell,
  JsonLd,
} from '@vigil/web-framework';
import { siteNav } from '@/config/site';

export const dynamicParams = false; // only committed pages exist; everything else 404s

export function generateStaticParams() {
  return getPageSlugs().map((f) => ({ slug: f === 'index' ? [] : f.split('__') }));
}

export function generateMetadata({ params }: { params: { slug?: string[] } }): Metadata {
  // '/og-staffing.webp' resolves against metadataBase → the site-default OG image.
  return buildPageMetadata(getPage(paramsToFile(params.slug ?? [])), { ogImage: '/og-staffing.webp' });
}

export default function Page({ params }: { params: { slug?: string[] } }) {
  const page = getPage(paramsToFile(params.slug ?? []));
  if (!page) notFound();
  // Shell v2 renders the complete, coordinated shell (logo header + accessible mobile
  // nav + complete footer + ONE governed sticky CTA) around the JSON content.
  return (
    <>
      <JsonLd page={page} origin="https://staffing.vigilservices.co.uk" />
      <Shell page={page} nav={siteNav}>
        <RenderSections page={page} />
      </Shell>
    </>
  );
}
