import type { PageJson } from '@/lib/pages/loader';

// Text-only prose block for migrated/restored source body content. No image slot.
// (Faithful-first migration: repeated/low-value source prose is migrated verbatim and
// flagged editorial_review_recommended in the JSON — the editorial phase shortens/merges.)
export function Prose({ fields, page }: { fields: any; page: PageJson }) {
  if (!fields?.body) return null;
  return (
    <section style={{ background: page.brand.bg, color: page.brand.text }} className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {fields.heading && <h2 className="mb-4 text-2xl font-medium">{fields.heading}</h2>}
        <p className="leading-relaxed opacity-80">{fields.body}</p>
      </div>
    </section>
  );
}
