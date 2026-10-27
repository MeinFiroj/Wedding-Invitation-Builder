import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio, 2);
    const mouse = { x: -1000, y: -1000 };
    const click = { x: 0, y: 0, strength: 0, radius: 0 };
    let particles = [];
    let width = 0;
    let raf;
    let t = 0;
    let cancelled = false;

    // Draw "VOWCARD" offscreen, then turn every filled pixel (on a grid) into a particle
    const init = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      width = w;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = '#fff';
      ctx.font = `700 ${Math.min(w * 0.14, 120)}px "DM Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VOWCARD', w / 2, h / 2);

      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const step = Math.round(4 * dpr); // ~4 CSS px between particles on every screen
      particles = [];
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          if (data[(y * canvas.width + x) * 4 + 3] > 128) {
            const hx = x / dpr;
            const hy = y / dpr;
            particles.push({
              x: Math.random() * w,
              y: Math.random() * h,
              hx,
              hy,
              wx: hx + (Math.random() - 0.5) * 100,
              wy: hy + (Math.random() - 0.5) * 100,
              vx: 0,
              vy: 0,
              size: 1.5 + Math.random() * 2,
              alpha: 0.4 + Math.random() * 0.6,
            });
          }
        }
      }
      ctx.clearRect(0, 0, w, h);
    };

    const push = (p, fromX, fromY, radius, strength) => {
      const dx = p.x - fromX;
      const dy = p.y - fromY;
      const dist = Math.hypot(dx, dy);
      if (dist > 0 && dist < radius) {
        const force = (1 - dist / radius) * strength;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    };

    const animate = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const cycle = Math.sin(t * 1.5) * 0.5 + 0.5; // 0 = scattered, 1 = formed
      const wander = 1 - cycle;
      const clicking = click.strength > 2;
      if (clicking) {
        click.strength *= 0.95;
        click.radius *= 0.98;
      }

      particles.forEach((p, i) => {
        const drift = Math.sin(t + i * 0.1) * 2;
        p.vx += (p.hx + (p.wx - p.hx) * wander - p.x + drift) * 0.05;
        p.vy += (p.hy + (p.wy - p.hy) * wander - p.y + drift) * 0.05;

        push(p, mouse.x, mouse.y, 100, 2);
        if (clicking) push(p, click.x, click.y, click.radius, click.strength * 0.1);

        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;

        const size = p.size * (0.5 + 0.5 * cycle);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha * (0.3 + 0.7 * cycle) * 0.7})`;
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
      });

      raf = requestAnimationFrame(animate);
    };

    const toLocal = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e) => Object.assign(mouse, toLocal(e));
    const onLeave = () => Object.assign(mouse, { x: -1000, y: -1000 });
    const onClick = (e) => Object.assign(click, toLocal(e), { strength: 80, radius: 150 });
    // Only rebuild when width changes (mobile scroll fires resize when the address bar hides)
    const onResize = () => canvas.offsetWidth !== width && init();

    // Wait for the font so the sampled text uses DM Sans, not a fallback
    document.fonts.ready.then(() => {
      if (cancelled) return;
      init();
      raf = requestAnimationFrame(animate);
    });

    window.addEventListener('resize', onResize);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', onClick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <section className="relative w-full h-dvh overflow-hidden bg-canvas">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 pointer-events-none">
        <span className="mb-6 text-[11px] font-semibold tracking-[0.08em] uppercase text-gold">
          Premium Digital Wedding Invitations
        </span>

        <h1 className="mb-6 max-w-175 text-[40px] md:text-[72px] font-medium tracking-tight leading-[1.1] text-ink">
          Create Your Wedding Invitation
        </h1>

        <p className="mb-10 max-w-130 text-base md:text-xl font-light italic tracking-wide leading-relaxed text-ink-dim">
          Fill a simple form, get a stunning animated invitation page, and share it with your
          guests instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 pointer-events-auto">
          <Link
            to="/templates"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-ink text-canvas text-sm font-medium tracking-wide rounded hover:bg-ink/85 transition-colors"
          >
            Create My Invitation <ArrowRight size={16} />
          </Link>
          <Link
            to="/invite/demo"
            className="flex items-center justify-center px-8 py-3 border border-line-strong text-ink-dim text-sm font-medium rounded hover:bg-line transition-colors"
          >
            View Live Demo
          </Link>
        </div>

        <p className="text-[13px] text-ink-muted">
          100% free &middot; No sign-up needed.
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-px h-10 bg-ink-muted animate-pulse-opacity" />
    </section>
  );
}