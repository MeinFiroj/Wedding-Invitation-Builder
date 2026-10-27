import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, Sparkles, Copy, MessageCircle, Check,Share2 } from "lucide-react";
import { useInvitation } from "@/context/InvitationContext";
import { templates } from "@/data/templates";
import { formatDate, formatTime } from "@/utils/format";
import InvitationPreview from "@/components/InvitationPreview";
import { sharePath, shareUrl } from '@/utils/share';

const stepTitles = [
  "Couple Details",
  "Wedding Event",
  "Wedding Details",
  "Media",
  "Review & Generate",
];

const included = [
  "Animated invitation page",
  "Scratch-to-reveal date",
  "Live countdown timer",
  "Program timeline",
  "Venue with map",
  "Dress code section",
  "Pre-wedding events",
];

const inputCls =
  "w-full bg-surface-2 border border-line rounded px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-gold focus:outline-none transition-colors";
const labelCls =
  "block mb-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-dim";
const cardCls = "bg-surface-2 rounded p-5 border border-line";

function Field({ label, hint, textarea, ...props }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <Tag
        className={`${inputCls} ${textarea ? "min-h-22.5 resize-none" : ""}`}
        {...props}
      />
      {hint && <p className="mt-1.5 text-xs text-ink-muted">{hint}</p>}
    </label>
  );
}

// Editable list with add/remove. children(item, bind) renders the inputs for one row.
function ListEditor({ label, items, blank, onChange, children }) {
  const bind = (i) => (key) => (e) =>
    onChange(
      items.map((item, j) =>
        j === i ? { ...item, [key]: e.target.value } : item,
      ),
    );

  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="p-3 space-y-2 bg-surface-2 border border-line rounded"
          >
            {children(item, bind(i))}
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="text-xs text-ink-muted hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, blank])}
        className="mt-3 text-[13px] text-gold hover:text-ink transition-colors"
      >
        + Add Event
      </button>
    </div>
  );
}

function ShareActions({ data }) {
  const { saveCard } = useInvitation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const url = shareUrl(data);
  const text = `You're invited to ${data.partner1Name} & ${data.partner2Name}'s wedding!`;
  const btn =
    'flex items-center justify-center gap-2 py-3 text-[13px] font-medium rounded border border-line-strong hover:bg-line transition-colors';

  const preview = () => {
    saveCard();
    navigate(sharePath(data));
  };
  const copy = async () => {
    saveCard();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={preview}
        className="flex items-center justify-center gap-2 w-full py-4 bg-gold text-canvas text-sm font-medium rounded hover:bg-gold/90 transition-colors"
      >
        <Sparkles size={16} /> Save &amp; Preview Invitation
      </button>
      <div className="grid grid-cols-2 gap-3">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`}
          onClick={saveCard}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
        >
          <MessageCircle size={14} /> WhatsApp
        </a>
        <button onClick={copy} className={btn}>
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
      {navigator.share && (
        <button
          onClick={() => {
            saveCard();
            navigator.share({ title: text, url }).catch(() => {});
          }}
          className={`${btn} w-full`}
        >
          <Share2 size={14} /> More Options
        </button>
      )}
      <Link to="/my-invitations" className="block pt-1 text-center text-xs text-ink-muted hover:text-gold transition-colors">
        Saved on this device &middot; View My Invitations
      </Link>
    </div>
  );
}

export default function EditorPage() {
  const [params] = useSearchParams();
  const { template, data, selectTemplate, updateData } = useInvitation();
  const [step, setStep] = useState(0);
  const last = stepTitles.length - 1;
  const set = (key) => (e) => updateData({ [key]: e.target.value });
  const templateId = params.get("template");

  useEffect(() => {
    const t = templates.find((t) => t.id === templateId);
    if (t) selectTemplate(t);
  }, [templateId, selectTemplate]);

  const summary = [
    ["Couple", `${data.partner1Name} & ${data.partner2Name}`],
    ["Date", formatDate(data.weddingDate)],
    ["Venue", data.venueName],
    ["Time", formatTime(data.weddingTime)],
  ];

  return (
    <main className="min-h-screen pt-16 flex flex-col lg:flex-row">
      <div className="w-full lg:w-2/5 h-[calc(100dvh-4rem)] flex flex-col bg-surface border-r border-line">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <Link
            to="/templates"
            className="flex items-center gap-2 text-[13px] text-ink-dim hover:text-ink transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </Link>
          <span className="hidden sm:block text-[11px] text-ink-muted">Draft auto-saved</span>
          <span className="text-[13px] font-medium text-gold">
            {template.name}
          </span>
        </div>

        <div className="flex items-center gap-2 px-6 py-4">
          {stepTitles.map((title, i) => (
            <button
              key={title}
              aria-label={title}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? "w-6 bg-gold" : "w-3 bg-line-strong"
              }`}
            />
          ))}
          <span className="ml-auto text-[11px] text-ink-muted">
            Step {step + 1} of {stepTitles.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <h2 className="text-xl font-medium">{stepTitles[step]}</h2>

          {step === 0 && (
            <>
              <Field
                label="Partner 1 Name"
                value={data.partner1Name}
                onChange={set("partner1Name")}
                placeholder="e.g. Arjun"
              />
              <Field
                label="Partner 2 Name"
                value={data.partner2Name}
                onChange={set("partner2Name")}
                placeholder="e.g. Priya"
              />
              <Field
                label="Tagline"
                value={data.tagline}
                onChange={set("tagline")}
                placeholder="e.g. Together Forever"
              />
            </>
          )}

          {step === 1 && (
            <>
              <Field
                label="Wedding Date"
                type="date"
                value={data.weddingDate}
                onChange={set("weddingDate")}
              />
              <Field
                label="Wedding Time"
                type="time"
                value={data.weddingTime}
                onChange={set("weddingTime")}
              />
              <Field
                label="Venue Name"
                value={data.venueName}
                onChange={set("venueName")}
                placeholder="e.g. The Grand Palace"
              />
              <Field
                label="Venue Address"
                value={data.venueAddress}
                onChange={set("venueAddress")}
                placeholder="e.g. 123 Royal Avenue, Mumbai"
              />
            </>
          )}

          {step === 2 && (
            <>
              <Field
                textarea
                label="Welcome Message"
                value={data.welcomeMessage}
                onChange={set("welcomeMessage")}
                placeholder="Your welcome message for guests..."
              />

              <ListEditor
                label="Program Timeline"
                items={data.timeline}
                blank={{ time: "", title: "", description: "" }}
                onChange={(timeline) => updateData({ timeline })}
              >
                {(item, bind) => (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        className={inputCls}
                        value={item.time}
                        onChange={bind("time")}
                        placeholder="Time"
                      />
                      <input
                        className={`${inputCls} col-span-2`}
                        value={item.title}
                        onChange={bind("title")}
                        placeholder="Event title"
                      />
                    </div>
                    <input
                      className={inputCls}
                      value={item.description}
                      onChange={bind("description")}
                      placeholder="Description"
                    />
                  </>
                )}
              </ListEditor>

              <Field
                label="Dress Code - Women"
                value={data.dressCodeWomen}
                onChange={set("dressCodeWomen")}
                placeholder="e.g. Elegant formal attire in pastel tones"
              />
              <Field
                label="Dress Code - Men"
                value={data.dressCodeMen}
                onChange={set("dressCodeMen")}
                placeholder="e.g. Suit or traditional formal wear"
              />

              <ListEditor
                label="Pre-Wedding Events"
                items={data.preWeddingEvents}
                blank={{ name: "", date: "", time: "", venue: "" }}
                onChange={(preWeddingEvents) =>
                  updateData({ preWeddingEvents })
                }
              >
                {(item, bind) => (
                  <>
                    <input
                      className={inputCls}
                      value={item.name}
                      onChange={bind("name")}
                      placeholder="Event name"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        className={inputCls}
                        value={item.date}
                        onChange={bind("date")}
                      />
                      <input
                        type="time"
                        className={inputCls}
                        value={item.time}
                        onChange={bind("time")}
                      />
                    </div>
                    <input
                      className={inputCls}
                      value={item.venue}
                      onChange={bind("venue")}
                      placeholder="Venue"
                    />
                  </>
                )}
              </ListEditor>

              <Field
                textarea
                label="Transportation"
                value={data.transportation}
                onChange={set("transportation")}
                placeholder="Transportation details for guests..."
              />
            </>
          )}

          {step === 3 && (
            <Field
              label="Hero Image URL"
              value={data.heroImage}
              onChange={set("heroImage")}
              placeholder="https://example.com/your-photo.jpg"
              hint="Paste an image URL for your invitation hero background"
            />
          )}

          {step === last && (
            <>
              <div className={`${cardCls} space-y-4`}>
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className="text-gold" />
                  <div>
                    <span className="text-[13px] text-ink-dim">Template</span>
                    <p className="text-sm font-medium">{template.name}</p>
                  </div>
                </div>
                <div className="h-px bg-line" />
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                  {summary.map(([label, value]) => (
                    <div key={label}>
                      <span className="block text-ink-dim">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cardCls}>
                <h3 className="mb-3 text-sm font-medium">
                  What&apos;s Included
                </h3>
                <ul className="space-y-2">
                  {included.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-[13px] text-ink-dim"
                    >
                      <span className="size-1 rounded-full bg-gold" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <ShareActions data={data} />
            </>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-line">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded text-ink-dim hover:text-ink hover:bg-line transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft size={14} /> Previous
          </button>
          <button
            onClick={() => setStep(step + 1)}
            disabled={step === last}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded bg-ink text-canvas hover:bg-ink/85 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            Next <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Live preview */}
      <div className="hidden lg:block w-3/5 h-[calc(100dvh-4rem)] overflow-y-auto">
        <InvitationPreview template={template} data={data} autoOpen />
      </div>
    </main>
  );
}
