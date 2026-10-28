import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Plus, Pencil, Eye, Copy, Check, Trash2 } from 'lucide-react';
import { useInvitation } from '@/context/InvitationContext';
import { templates } from '@/data/templates';
import { formatDate } from '@/utils/format';
import { sharePath, shareUrl } from '@/utils/share';

const btn =
  'flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded border border-line-strong hover:bg-line transition-colors';

export default function MyInvitationsPage() {
  const { cards, openCard, deleteCard, startNew } = useInvitation();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState(null);

  const edit = (id) => {
    openCard(id);
    navigate('/editor');
  };
  const create = () => {
    startNew();
    navigate('/templates');
  };
  const copy = async (card) => {
    await navigator.clipboard.writeText(shareUrl(card.id));
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  const remove = (card) => {
    const { partner1Name, partner2Name } = card.data;
    if (window.confirm(`Delete ${partner1Name} & ${partner2Name}'s invitation?`)) deleteCard(card.id);
  };

  return (
    <main className="min-h-screen pt-24 pb-30 px-6 md:px-12">
      <div className="max-w-300 mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <span className="block mb-3 text-[11px] font-semibold tracking-[0.08em] uppercase text-gold">
              Saved on this device
            </span>
            <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight">My Invitations</h1>
          </div>
          <button
            onClick={create}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium rounded bg-ink text-canvas hover:bg-ink/85 transition-colors"
          >
            <Plus size={16} /> Create New
          </button>
        </div>

        {cards.length === 0 ? (
          <p className="py-24 text-center text-ink-dim">
            No saved invitations yet. Finish one in the editor and it will appear here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => {
              const { partner1Name, partner2Name, weddingDate, templateId } = card.data;
              const tpl = templates.find((t) => t.id === templateId) ?? templates[0];
              return (
                <div key={card.id} className="overflow-hidden bg-surface-2 border border-line rounded">
                  <img src={tpl.image} alt={tpl.name} loading="lazy" className="object-cover w-full aspect-4/3" />
                  <div className="p-5">
                    <h3 className="text-lg font-medium">
                      {partner1Name} &amp; {partner2Name}
                    </h3>
                    <p className="mt-1 text-sm text-ink-dim">{formatDate(weddingDate)}</p>
                    <p className="mt-1 mb-4 text-xs text-ink-muted">
                      {tpl.name} &middot; Saved {new Date(card.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => edit(card.id)} className={btn}>
                        <Pencil size={13} /> Edit
                      </button>
                      <Link to={sharePath(card.id)} className={btn}>
                        <Eye size={13} /> View
                      </Link>
                      <button onClick={() => copy(card)} className={btn}>
                        {copiedId === card.id ? <Check size={13} /> : <Copy size={13} />}
                        {copiedId === card.id ? 'Copied!' : 'Copy Link'}
                      </button>
                      <button onClick={() => remove(card)} className={`${btn} hover:text-red-400`}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}