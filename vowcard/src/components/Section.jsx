export default function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`w-full py-30 px-6 md:px-12 scroll-mt-16 ${className}`}>
      <div className="max-w-300 mx-auto">{children}</div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, text }) {
  return (
    <div className="text-center mb-16">
      {eyebrow && (
        <span className="block mb-4 text-[11px] font-semibold tracking-[0.08em] uppercase text-gold">
          {eyebrow}
        </span>
      )}
      <h2 className="text-[32px] md:text-[40px] font-medium tracking-tight leading-tight text-ink">
        {title}
      </h2>
      {text && (
        <p className="mt-4 text-[17px] text-ink-dim max-w-150 mx-auto leading-[1.7]">{text}</p>
      )}
    </div>
  );
}