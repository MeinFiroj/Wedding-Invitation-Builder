import { Star } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import Section, { SectionHeader } from '@/components/Section';

const testimonials = [
  { quote: 'The scratch card reveal was a hit among our friends. Beautiful experience that made our invitation truly special.', names: 'Ananya & Vikram', location: 'Mumbai, India' },
  { quote: 'Professional, elegant, and so much better than paper cards. Highly recommend to every couple planning their wedding!', names: 'Emma & James', location: 'London, UK' },
  { quote: 'We received so many compliments on our invitation. The animations made it feel so personal and special.', names: 'Meera & Rohit', location: 'Delhi, India' },
];

export default function TestimonialsSection() {
  const ref = useScrollReveal(0.1);

  return (
    <Section className="bg-surface">
      <SectionHeader title="What Our Couples Say" />
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.names} data-reveal className="bg-surface-2 rounded p-8 border border-line">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={16} className="fill-gold stroke-gold" />
              ))}
            </div>
            <p className="mb-6 text-[15px] italic text-ink leading-[1.7]">&ldquo;{t.quote}&rdquo;</p>
            <p className="text-sm font-medium text-copper">{t.names}</p>
            <p className="text-[13px] text-ink-muted">{t.location}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}