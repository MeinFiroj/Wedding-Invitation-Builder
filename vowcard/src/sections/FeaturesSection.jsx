import { Sparkles, Clock, MessageCircle, Smartphone, MapPin, Wand2, Image, Sliders } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import Section, { SectionHeader } from '@/components/Section';

const features = [
  { icon: Sparkles, title: 'Scratch to Reveal', description: 'Interactive scratch card reveals the wedding date with a delightful surprise moment.' },
  { icon: Clock, title: 'Live Countdown', description: 'Animated countdown timer tracking days, hours, minutes until your special day.' },
  { icon: MessageCircle, title: 'Share Anywhere', description: 'One link that opens beautifully on WhatsApp, Instagram and every phone.' },
  { icon: Smartphone, title: 'Made for Phones', description: 'Looks and feels perfect on every screen, built for sharing on WhatsApp.' },
  { icon: MapPin, title: 'Venue with Maps', description: 'Embedded interactive map with directions to your wedding venue.' },
  { icon: Wand2, title: 'Premium Animations', description: 'Door reveals, curtain opens, sparkles, and smooth scroll transitions.' },
  { icon: Image, title: 'Custom Images', description: 'Upload your couple photos as hero backgrounds and gallery slideshows.' },
  { icon: Sliders, title: 'Full Customization', description: 'Toggle sections, set dress codes, add events, and personalize every detail.' },
];

export default function FeaturesSection() {
  const ref = useScrollReveal(0.08);

  return (
    <Section id="features" className="bg-surface border-y border-line">
      <SectionHeader
        eyebrow="Everything You Need"
        title="Premium Features"
        text="Every invitation comes packed with interactive features that make your wedding announcement unforgettable."
      />
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            data-reveal
            className="bg-surface-2 border border-line rounded p-8 hover:border-line-strong transition-colors duration-300"
          >
            <Icon size={24} strokeWidth={1.5} className="block mb-5 text-gold" />
            <h3 className="mb-2.5 text-lg font-medium tracking-tight text-ink">{title}</h3>
            <p className="text-sm text-ink-dim leading-[1.7]">{description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}