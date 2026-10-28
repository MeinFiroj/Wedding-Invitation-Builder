import { useScrollReveal } from '@/hooks/useScrollReveal';
import Section, { SectionHeader } from '@/components/Section';

const steps = [
  { title: 'Choose Template', description: 'Browse 8 premium, uniquely crafted designs.' },
  { title: 'Fill Details', description: 'Enter your wedding details: names, venue, dates.' },
  { title: 'Preview & Edit', description: 'See your invitation come to life in real-time.' },
  { title: 'Share Link', description: 'Get a unique invitation link and share it anywhere.' },
];

export default function HowItWorksSection() {
  const ref = useScrollReveal(0.15);

  return (
    <Section id="how-it-works">
      <SectionHeader eyebrow="Simple Process" title="Create in 4 Easy Steps" />
      <div ref={ref} className="relative">
        <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-line" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, i) => (
            <div key={step.title} data-reveal className="text-center">
              <div className="relative z-10 inline-flex items-center justify-center w-12 h-12 mb-5 rounded-full border border-gold bg-canvas text-gold font-semibold">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="mb-2 text-lg font-medium tracking-tight text-ink">{step.title}</h3>
              <p className="text-sm text-ink-dim leading-[1.7]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}