import { Link } from 'react-router';
import { Heart } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: [['Templates', '/templates'], ['Features', '/#features'], ['Pricing', '/#pricing']],
  },
  { title: 'Company', links: [['About'], ['Contact'], ['Terms']] },
  { title: 'Support', links: [['Help Center'], ['Privacy']] },
];

const itemCls = 'text-sm text-ink-dim';

export default function Footer() {
  return (
    <footer className="bg-canvas border-t border-line">
      <div className="max-w-300 mx-auto px-6 md:px-12 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div>
            <Link to="/" className="block mb-4 text-xl font-semibold tracking-[0.08em] text-ink">
              VOWCARD
            </Link>
            <p className="text-sm text-ink-dim leading-relaxed">
              Premium digital wedding invitations. Create, customize, and share your perfect
              invitation in minutes.
            </p>
          </div>

          {columns.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-muted mb-4">
                {title}
              </h4>
              <div className="flex flex-col gap-3">
                {links.map(([label, to]) =>
                  to ? (
                    <Link key={label} to={to} className={`${itemCls} hover:text-ink transition-colors`}>
                      {label}
                    </Link>
                  ) : (
                    <span key={label} className={itemCls}>{label}</span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-line text-[13px] text-ink-muted">
          <p>&copy; {new Date().getFullYear()} VowCard. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={12} className="text-gold" /> for your special day
          </p>
        </div>
      </div>
    </footer>
  );
}