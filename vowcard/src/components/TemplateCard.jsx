import { Link } from 'react-router';
import { Eye, Check } from 'lucide-react';

export default function TemplateCard({ template }) {
  const { id, name, image, badge, category, description } = template;
  return (
    <div
      data-reveal
      className="group bg-surface-2 rounded overflow-hidden border border-line hover:border-line-strong hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300"
    >
      <div className="relative aspect-3/4 overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {badge && (
          <span
            className={`absolute top-3 left-3 text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded text-canvas ${
              badge === 'New' ? 'bg-green-400' : 'bg-gold'
            }`}
          >
            {badge}
          </span>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center border">
          <Link
            to={`/invite/demo?template=${id}`}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-ink/15 backdrop-blur-sm text-ink text-[13px] rounded hover:bg-ink/25 transition-colors h-full w-full "
          >
            <Eye size={14} /> Preview
          </Link>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-lg font-medium tracking-tight text-ink">{name}</h3>
          <span className="text-[11px] text-ink-muted uppercase tracking-wider">{category}</span>
        </div>
        <p className="text-sm text-ink-dim leading-relaxed mb-4 line-clamp-2">{description}</p>
        <Link
          to={`/editor?template=${id}`}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-line text-ink text-[13px] font-medium rounded hover:bg-line-strong transition-colors"
        >
          <Check size={14} /> Select Template
        </Link>
      </div>
    </div>
  );
}