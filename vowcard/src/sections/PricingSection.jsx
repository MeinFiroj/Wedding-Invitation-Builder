import { Link } from 'react-router';
import { Check } from 'lucide-react';
import Section, { SectionHeader } from '@/components/Section';

const features = [
  '8 premium animated templates',
  'Smooth door-opening reveal',
  'Scratch-to-reveal date & live countdown',
  'Program timeline & dress code',
  'Venue map link',
];

export default function PricingSection() {
  return (
    <Section id="pricing">
      <SectionHeader eyebrow="Pricing" title="Free. Everything Included." />
      <div className="max-w-110 mx-auto bg-surface-2 border border-gold-dim rounded p-12 text-center">
        <span className="block mb-4 text-sm text-ink-dim">Launch Offer</span>
        <div className="mb-2 text-5xl font-bold text-ink">Free</div>
        <p className="mb-8 text-sm text-ink-dim">No payment &middot; No credit card</p>

        <ul className="mb-8 text-left">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3 py-2.5 text-sm text-ink/80">
              <Check size={18} className="mt-0.5 shrink-0 text-gold" />
              {f}
            </li>
          ))}
        </ul>

        <Link
          to="/templates"
          className="block w-full py-4 bg-gold text-canvas text-sm font-medium rounded hover:bg-gold/90 transition-colors"
        >
          Start Creating
        </Link>
      </div>
    </Section>
  );
}