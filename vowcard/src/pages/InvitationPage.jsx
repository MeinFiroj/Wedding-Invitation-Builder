import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { useInvitation } from '@/context/InvitationContext';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { templates, defaultWeddingData } from '@/data/templates';
import { fetchCard } from '@/utils/api';
import InvitationPreview from '@/components/InvitationPreview';

const Message = ({ children }) => (
  <div className="min-h-dvh flex flex-col items-center justify-center gap-4 text-ink-dim text-sm">{children}</div>
);

export default function InvitationPage() {
  const { id } = useParams(); // only on /i/:id; /invite/demo previews the editor's card
  const [params] = useSearchParams();
  const { template, data } = useInvitation();
  const [card, setCard] = useState(null);
  const [missing, setMissing] = useState(false);
  useSmoothScroll();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;
    fetchCard(id)
      .then((d) => setCard({ ...defaultWeddingData, ...d }))
      .catch(() => setMissing(true));
  }, [id]);

  if (id && missing)
    return (
      <Message>
        This invitation could not be found.
        <Link to="/" className="text-gold">Go to VowCard</Link>
      </Message>
    );
  if (id && !card) return <Message>Loading invitation…</Message>;

  const active = id
    ? templates.find((t) => t.id === card.templateId)
    : templates.find((t) => t.id === params.get('template')) ?? template;

  return <InvitationPreview template={active ?? templates[0]} data={id ? card : data} />;
}