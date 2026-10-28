import { useState } from 'react';
import { templates } from '../data/templates';
import TemplateCard from '../components/TemplateCard';

const categories = ['All', 'Classic', 'Modern', 'Royal', 'Romantic'];

export default function TemplatesPage() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? templates : templates.filter((t) => t.category === active);

  return (
    <main className="min-h-screen pt-24 pb-30 px-6 md:px-12">
      <div className="max-w-300 mx-auto">
        <div className="text-center mb-12">
          <span className="block mb-4 text-[11px] font-semibold tracking-[0.08em] uppercase text-gold">
            Choose Your Design
          </span>
          <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight leading-tight mb-4">
            Wedding Invitation Templates
          </h1>
          <p className="text-[17px] text-ink-dim max-w-140 mx-auto leading-[1.7]">
            Select a template that speaks to your love story. All {templates.length} premium designs
            are free to use.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 text-[13px] font-medium rounded transition-colors ${
                active === cat
                  ? 'bg-ink text-canvas'
                  : 'bg-line text-ink-dim hover:bg-line-strong'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </div>
    </main>
  );
}