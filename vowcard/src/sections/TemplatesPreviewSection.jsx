import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { templates } from '@/data/templates';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import Section, { SectionHeader } from '@/components/Section';
import TemplateCard from '@/components/TemplateCard';

export default function TemplatesPreviewSection() {
  const ref = useScrollReveal(0.08);

  return (
    <Section>
      <SectionHeader
        eyebrow="Choose Your Design"
        title={`${templates.length} Premium Wedding Invitation Templates`}
        text="Select a template that speaks to your love story. Each design includes animated reveals, countdown timers, and smooth animations."
      />
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.slice(0, 4).map((t) => (
          <TemplateCard key={t.id} template={t} />
        ))}
      </div>
      <div className="text-center mt-10">
        <Link
          to="/templates"
          className="inline-flex items-center gap-2 text-sm text-gold hover:text-ink transition-colors"
        >
          View All {templates.length} Templates <ChevronRight size={16} />
        </Link>
      </div>
    </Section>
  );
}