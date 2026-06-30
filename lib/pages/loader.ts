import fs from 'fs';
import path from 'path';

const DIR = path.join(process.cwd(), 'content/pages');

export type Section = { type: string; fields: Record<string, any> };
export type PageJson = {
  schema_version: number;
  site: string;
  slug: string;
  page_type: string;
  status?: string;
  seo: {
    title: string;
    description: string;
    canonical: string;
    focus_keyword?: string;
    schema_type?: string;
    og_image?: string;
    noindex?: boolean;
  };
  brand: { bg: string; text: string; cta: string; secondary: string };
  nap: { phone: string; email?: string; address?: string; trading_name: string; enquiry_url: string };
  sections: Section[];
};

export function getPageSlugs(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
    .map((f) => f.replace(/\.json$/, ''));
}

export function getPage(slugFile: string): PageJson | null {
  const fp = path.join(DIR, `${slugFile}.json`);
  if (!fs.existsSync(fp)) return null;
  return JSON.parse(fs.readFileSync(fp, 'utf8')) as PageJson;
}

// slug path segments (["a","b"]) <-> file name ("a__b"); homepage <-> "index"
export const paramsToFile = (parts: string[]) =>
  parts && parts.length ? parts.join('__') : 'index';

// Canonical image contract: a slot image is { url, alt, id, public_id, source_url,
// source, status } OR a legacy bare URL string. These read either shape (one
// interpretation) so render never breaks on the shape.
export type ImageRef =
  | string
  | { url?: string; alt?: string; id?: number; public_id?: string; source_url?: string; source?: string; status?: string }
  | null
  | undefined;

export function imgSrc(image: ImageRef): string | null {
  if (!image) return null;
  if (typeof image === 'string') return image;
  return image.url ?? null;
}

export function imgAlt(image: ImageRef, siblingAlt?: string): string {
  if (image && typeof image === 'object' && image.alt) return image.alt;
  return siblingAlt ?? '';
}
