import type { PageJson, Section } from '@/lib/pages/loader';
import { Hero } from './Hero';
import { ServiceGrid } from './ServiceGrid';
import { TextImage } from './TextImage';
import { Prose } from './Prose';
import { Cta } from './Cta';
import { Faq } from './Faq';
import { Testimonial } from './Testimonial';
import { ContactForm } from './ContactForm';
import { BoroughBlock } from './BoroughBlock';

type SectionProps = { fields: any; page: PageJson };

const MAP: Record<string, React.FC<SectionProps>> = {
  hero: Hero,
  service_grid: ServiceGrid,
  text_image: TextImage,
  prose: Prose,
  cta: Cta,
  faq: Faq,
  testimonial: Testimonial,
  contact_form: ContactForm,
  borough_block: BoroughBlock,
};

export function RenderSections({ page }: { page: PageJson }) {
  return (
    <>
      {page.sections.map((s: Section, i: number) => {
        const C = MAP[s.type];
        if (!C) {
          // Parity guard: an unknown section type means the CRM registry and the
          // website registry drifted. Fail loudly outside production.
          if (process.env.NODE_ENV !== 'production') {
            throw new Error(`Unknown section type: ${s.type}`);
          }
          return null;
        }
        return <C key={i} fields={s.fields} page={page} />;
      })}
    </>
  );
}
