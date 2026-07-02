import type { MetadataRoute } from 'next';
import { getPage, getPageSlugs } from '@vigil/web-framework';

const BASE = 'https://staffing.vigilservices.co.uk';

export default function sitemap(): MetadataRoute.Sitemap {
  return getPageSlugs()
    .map((f) => getPage(f))
    .filter((p): p is NonNullable<typeof p> => !!p && !p.seo.noindex)
    .map((p) => ({
      url: `${BASE}${(p.seo.canonical.replace(/\/$/, '') || '/')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: p.page_type === 'homepage' ? 1 : 0.7,
    }));
}
