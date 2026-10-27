import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, animate } from "motion/react";
import { MapPin, Clock, Heart, User, ChevronDown } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { formatDate, formatTime } from "@/utils/format";

const EASE = [0.22, 1, 0.36, 1];

const nameFont = {
  serif: "font-display",
  script: "font-script",
  sans: "font-sans font-semibold tracking-wide",
};

const accentBtn =
  "inline-flex items-center justify-center gap-2 px-6 py-3 rounded text-[13px] font-medium bg-(--accent) text-(--bg) transition-transform hover:scale-105";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.8 } },
};

const rise = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: EASE },
  },
};

/* ---------- building blocks ---------- */

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 48, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function Block({
  eyebrow,
  title,
  width = "max-w-[600px]",
  className = "",
  children,
}) {
  return (
    <section className={`py-16 px-4 sm:px-6 relative ${className}`}>
      <div className={`mx-auto text-center relative z-10 ${width}`}>
        {(eyebrow || title) && (
          <Reveal className="mb-8">
            {eyebrow && (
              <span className="block mb-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-(--accent) opacity-60">
                {eyebrow}
              </span>
            )}
            {title && <h2 className="text-2xl font-medium">{title}</h2>}
          </Reveal>
        )}
        {children}
      </div>
        <Sparkles/>
    </section>
  );
}

function Sparkles({ count = 18 }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 4,
        duration: 4 + Math.random() * 4,
      })),
    [count],
  );
  return (
    <div className="absolute z-0 inset-0 overflow-hidden pointer-events-none">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-(--accent)"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
          }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.8, 0] }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Countdown number that slides when it changes
function Digit({ value, label }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[1.2em] w-[2.2ch] overflow-hidden text-2xl sm:text-4xl md:text-5xl font-bold tabular-nums leading-[1.2]">
        <AnimatePresence initial={false}>
          <motion.span
            key={text}
            className="absolute inset-0 text-center"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[11px] font-semibold tracking-[0.08em] uppercase opacity-50">
        {label}
      </span>
    </div>
  );
}

/* ---------- opening doors ---------- */
function Cover({ opened, onOpen, onDone, initials, names, date, nameCls }) {
  const door = (side) => (
    <motion.div
      className="relative w-1/2 h-full bg-(--primary) backface-hidden"
      style={{ originX: side === "left" ? 0 : 1 }}
      animate={{ rotateY: opened ? (side === "left" ? 105 : -105) : 0 }}
      transition={{ duration: 1.6, ease: [0.77, 0, 0.18, 1] }}
      onAnimationComplete={() => opened && side === "right" && onDone()}
    >
      <div className="absolute inset-4 border border-(--accent)/40" />
      <div className="absolute inset-7 border border-(--accent)/20" />
    </motion.div>
  );

  return (
    <div
      onClick={opened ? undefined : onOpen}
      className={`fixed inset-0 z-50 flex perspective-[2000px] ${opened ? "pointer-events-none" : "cursor-pointer"}`}
    >
      {door("left")}
      {door("right")}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-(--ink)"
        animate={{ opacity: opened ? 0 : 1, scale: opened ? 1.15 : 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <motion.div
          className="grid size-24 mb-8 place-items-center rounded-full text-3xl font-medium bg-(--accent) text-(--bg) shadow-[0_0_60px_color-mix(in_srgb,var(--accent)_45%,transparent)]"
          animate={opened ? {} : { scale: [1, 1.07, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {initials}
        </motion.div>
        <h2 className={`mb-2 text-3xl md:text-4xl ${nameCls}`}>{names}</h2>
        <p className="text-sm opacity-70">{date}</p>
        <span className="mt-10 text-[11px] tracking-[0.3em] uppercase opacity-70 animate-pulse-opacity">
          Tap to open
        </span>
      </motion.div>
    </div>
  );
}

function ScratchReveal({ date, time, accent }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [revealed, setRevealed] = useState(false);

  // Paint the foil layer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio, 2);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    for (let x = 0; x < width; x += 4)
      for (let y = 0; y < height; y += 4)
        if (Math.random() > 0.5) ctx.fillRect(x, y, 2, 2);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = '600 14px "DM Sans", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SCRATCH TO REVEAL", width / 2, height / 2);
  }, [accent]);

  const scratch = (e) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(e.clientX - rect.left, e.clientY - rect.top, 20, 0, Math.PI * 2);
    ctx.fill();
  };

  // Measure how much is scratched only on release (cheap), sampling every 4th pixel
  const finish = () => {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current;
    const { data } = canvas
      .getContext("2d")
      .getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    for (let i = 3; i < data.length; i += 16) if (data[i] < 128) cleared++;
    if (cleared / (data.length / 16) > 0.35) setRevealed(true);
  };

  return (
    <div className="relative w-full max-w-90 mx-auto aspect-2/1 rounded overflow-hidden select-none bg-(--primary)">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="mb-2 text-[11px] font-semibold tracking-[0.08em] uppercase opacity-70">
          You&apos;re Invited!
        </span>
        <span className="text-2xl md:text-[28px] font-medium">
          {formatDate(date)}
        </span>
        <span className="mt-1 text-sm opacity-70">{formatTime(time)}</span>
      </div>
      {!revealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-pointer touch-none"
          onPointerDown={(e) => {
            drawing.current = true;
            scratch(e);
          }}
          onPointerMove={scratch}
          onPointerUp={finish}
          onPointerLeave={finish}
          onPointerCancel={finish}
        />
      )}
    </div>
  );
}

export default function InvitationPreview({
  template,
  data,
  autoOpen = false,
}) {
  const countdown = useCountdown(
    `${data.weddingDate}T${data.weddingTime || "00:00"}`,
  );
  const [opened, setOpened] = useState(autoOpen);
  const [coverGone, setCoverGone] = useState(autoOpen);

  const { colors } = template;
  const vars = {
    "--bg": colors.background,
    "--primary": colors.primary,
    "--accent": colors.accent,
    "--ink": colors.text,
  };
  const nameCls = nameFont[template.fontStyle] ?? "font-display";
  const initials =
    `${data.partner1Name.charAt(0)}${data.partner2Name.charAt(0)}`.toUpperCase();
  const names = (
    <>
      {data.partner1Name} <span className="opacity-40">&amp;</span>{" "}
      {data.partner2Name}
    </>
  );

  return (
    <div
      style={vars}
      // while the doors are closed the page can't scroll
      className={`min-h-dvh bg-(--bg) text-(--ink) ${opened ? "" : "h-dvh overflow-hidden"}`}
    >
      {!coverGone && (
        <Cover
          opened={opened}
          onOpen={() => setOpened(true)}
          onDone={() => setCoverGone(true)}
          initials={initials}
          names={names}
          date={formatDate(data.weddingDate)}
          nameCls={nameCls}
        />
      )}

      {/* Hero */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
        {data.heroImage && (
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${data.heroImage}")` }}
            animate={{ scale: 1.12 }}
            transition={{
              duration: 18,
              ease: "linear",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        )}
        <div
          className={`absolute inset-0 ${
            data.heroImage
              ? "bg-linear-to-b from-(--bg)/50 to-(--bg)"
              : "bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--primary)_27%,transparent),var(--bg)_70%)]"
          }`}
        />
        <Sparkles />

        <motion.div
          className="relative z-10 flex flex-col items-center"
          variants={stagger}
          initial="hidden"
          animate={opened ? "show" : "hidden"}
        >
          <motion.span
            variants={rise}
            className="block mb-6 text-[11px] font-semibold tracking-[0.08em] uppercase text-(--accent) opacity-70"
          >
            You&apos;re Invited
          </motion.span>
          <motion.h1
            variants={rise}
            className={`mb-4 text-[40px] md:text-[64px] leading-[1.15] tracking-tight ${nameCls}`}
          >
            {names}
          </motion.h1>
          <motion.p variants={rise} className="text-base italic opacity-70">
            {data.tagline}
          </motion.p>
          <motion.div
            variants={{
              hidden: { scaleX: 0 },
              show: { scaleX: 1, transition: { duration: 1.2, ease: EASE } },
            }}
            className="w-24 h-px my-6 bg-(--accent)"
          />
          <motion.p variants={rise} className="text-sm opacity-60">
            {formatDate(data.weddingDate)} &middot;{" "}
            {formatTime(data.weddingTime)}
          </motion.p>
        </motion.div>

        <motion.div
          className="absolute bottom-6 text-(--accent) opacity-60"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={22} />
        </motion.div>
      </section>

      {/* Welcome */}
      <Block width="max-w-[560px]">
        <Reveal>
          <div className="w-12 h-px mx-auto mb-8 bg-(--accent)" />
          <p className="text-[15px] md:text-base leading-[1.8] italic opacity-80">
            &ldquo;{data.welcomeMessage}&rdquo;
          </p>
          <div className="w-12 h-px mx-auto mt-8 bg-(--accent)" />
        </Reveal>
      </Block>

      <Block eyebrow="Scratch to Reveal">
        <Reveal>
          <ScratchReveal
            date={data.weddingDate}
            time={data.weddingTime}
            accent={colors.accent}
          />
        </Reveal>
      </Block>

      {/* Countdown */}
      <Block eyebrow="Counting Down to Forever" className="bg-(--primary)/15">
        <Reveal>
          <div className="inline-flex items-center gap-2 sm:gap-4 md:gap-8 px-6 sm:px-8 py-4 sm:py-6 rounded bg-(--bg)/80 border border-(--accent)/15">
            {Object.entries(countdown).map(([label, value], i) => (
              <Fragment key={label}>
                {i > 0 && (
                  <span className="text-2xl font-light opacity-40">:</span>
                )}
                <Digit value={value} label={label} />
              </Fragment>
            ))}
          </div>
        </Reveal>
      </Block>

      {/* Timeline */}
      <Block
        eyebrow="Program Timeline"
        title="The Celebration"
        width="max-w-[500px]"
      >
        <div className="relative text-left">
          <motion.div
            className="absolute left-1.25 top-2 bottom-2 w-px bg-(--accent)/30"
            style={{ originY: 0 }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: EASE }}
          />
          {data.timeline.map((e, i) => (
            <Reveal
              key={i}
              delay={i * 0.1}
              className="flex gap-6 pb-8 last:pb-0"
            >
              <span className="relative z-10 mt-1.5 size-3 shrink-0 rounded-full border-2 border-(--accent) bg-(--bg)" />
              <div>
                <span className="block mb-1 text-[13px] font-medium text-(--accent)">
                  {e.time}
                </span>
                <h4 className="mb-1 text-base font-medium">{e.title}</h4>
                <p className="text-[13px] opacity-50">{e.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Block>

      {/* Venue */}
      <Block width="max-w-[500px]" className="bg-(--primary)/10">
        <Reveal>
          <MapPin
            size={24}
            className="mx-auto mb-4 text-(--accent) opacity-60"
          />
          <h2 className="mb-2 text-2xl font-medium">{data.venueName}</h2>
          <p className="mb-6 text-sm opacity-60">{data.venueAddress}</p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(data.venueAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={accentBtn}
          >
            <MapPin size={14} /> View on Google Maps
          </a>
        </Reveal>
      </Block>

      {/* Dress code */}
      <Block eyebrow="Dress Code" title="What to Wear">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            ["Women", data.dressCodeWomen],
            ["Men", data.dressCodeMen],
          ].map(([who, text], i) => (
            <Reveal key={who} delay={i * 0.12}>
              <div className="p-6 rounded bg-(--primary)/15 transition-transform duration-300 hover:-translate-y-1">
                <User
                  size={20}
                  className="mx-auto mb-3 text-(--accent) opacity-60"
                />
                <h4 className="mb-2 text-sm font-medium">{who}</h4>
                <p className="text-[13px] opacity-60">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Block>

      {/* Pre-wedding events */}
      <Block
        eyebrow="Pre-Wedding Events"
        title="Festivities"
        className="bg-(--primary)/10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {data.preWeddingEvents.map((e, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <div className="h-full p-5 rounded bg-(--bg)/70 border border-(--accent)/15 transition-transform duration-300 hover:-translate-y-1">
                <h4 className="mb-2 text-base font-medium">{e.name}</h4>
                <p className="mb-1 text-xs opacity-50">{formatDate(e.date)}</p>
                <p className="mb-1 text-xs opacity-50">{formatTime(e.time)}</p>
                <p className="text-xs opacity-40">{e.venue}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Block>

      {data.transportation && (
        <Block width="max-w-[500px]" className="py-12!">
          <Reveal>
            <Clock
              size={20}
              className="mx-auto mb-3 text-(--accent) opacity-50"
            />
            <h4 className="mb-2 text-sm font-medium">Transportation</h4>
            <p className="text-[13px] opacity-50">{data.transportation}</p>
          </Reveal>
        </Block>
      )}

      <Block width="max-w-[440px]" className="bg-(--primary)/15">
        <Reveal>
          <Heart
            size={24}
            className="mx-auto mb-4 text-(--accent) opacity-60"
          />
          <h2 className="mb-3 text-2xl font-medium">Join Us in Celebration</h2>
          <p className="text-sm leading-[1.8] opacity-70">
            Our day will be complete only with the people we love beside us.
            Your presence and your blessings will make {data.partner1Name} &amp;{" "}
            {data.partner2Name}&apos;s wedding truly unforgettable. We would be
            honored to have you with us.
          </p>
          <div className="w-12 h-px mx-auto mt-8 bg-(--accent)" />
          <p className="mt-6 text-xs tracking-[0.08em] uppercase text-(--accent) opacity-70">
            With love, {data.partner1Name} &amp; {data.partner2Name}
          </p>
        </Reveal>
      </Block>

      <footer className="px-6 py-12 text-center border-t border-(--accent)/10">
        <p className={`mb-2 text-xl opacity-70 ${nameCls}`}>
          {data.partner1Name} &amp; {data.partner2Name}
        </p>
        <p className="text-xs opacity-40">
          Thank you for being part of our story
        </p>
        <p className="mt-6 text-[11px] opacity-25">Created with VowCard</p>
      </footer>
    </div>
  );
}
