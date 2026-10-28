import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Templates', to: '/templates' },
  { label: 'Features', to: '/#features' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Pricing', to: '/#pricing' },
  { label: 'My Invitations', to: '/my-invitations' },
];

const linkCls = 'text-sm text-ink-dim hover:text-ink transition-colors duration-200';
const ctaCls =
  'text-sm font-medium bg-ink text-canvas px-6 py-2.5 rounded text-center hover:bg-ink/85 transition-colors';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = navLinks.map((l) => (
    <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className={linkCls}>
      {l.label}
    </Link>
  ));

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 h-16 flex items-center transition-all duration-300 ${
        scrolled ? 'bg-canvas/90 backdrop-blur-xl border-b border-line' : 'bg-transparent'
      }`}
    >
      <div className="w-full max-w-300 mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-[0.08em] text-ink">
          VOWCARD
        </Link>

        <div className="hidden md:flex items-center gap-8">{links}</div>

        <Link to="/templates" className={`hidden md:block ${ctaCls}`}>
          Get Started
        </Link>

        <button
          className="md:hidden text-ink"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="absolute top-16 inset-x-0 bg-canvas/95 backdrop-blur-xl border-b border-line md:hidden">
          <div className="flex flex-col p-6 gap-4">
            {links}
            <Link to="/templates" onClick={() => setOpen(false)} className={ctaCls}>
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}