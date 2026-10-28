import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { defaultWeddingData, templates } from '@/data/templates';
import { readJSON, writeJSON } from '@/utils/storage';
import { createCard, updateCard } from '@/utils/api';

const DRAFT_KEY = 'vowcard:draft';
const CARDS_KEY = 'vowcard:cards';
const InvitationContext = createContext(null);

export function InvitationProvider({ children }) {
  const [data, setData] = useState(() => ({ ...defaultWeddingData, ...readJSON(DRAFT_KEY, {}).data }));
  const [cardId, setCardId] = useState(() => readJSON(DRAFT_KEY, {}).cardId ?? null);
  const [cards, setCards] = useState(() => readJSON(CARDS_KEY, []));

  // Auto-save everything to this browser
  useEffect(() => writeJSON(DRAFT_KEY, { data, cardId }), [data, cardId]);
  useEffect(() => writeJSON(CARDS_KEY, cards), [cards]);

  const template = templates.find((t) => t.id === data.templateId) ?? templates[0];

  const selectTemplate = useCallback(
    (t) => setData((d) => (d.templateId === t.id ? d : { ...d, templateId: t.id })),
    []
  );
  const updateData = useCallback((patch) => setData((d) => ({ ...d, ...patch })), []);

  // Save the current draft as a card in "My Invitations" (creates it, or updates the same one)
  const saveCard = useCallback(async () => {
  const existing = cards.find((c) => c.id === cardId);
  let id = cardId;
  let editKey = existing?.editKey;
  if (id && editKey) await updateCard(id, data, editKey);
  else ({ id, editKey } = await createCard(data));
  setCards((list) => [
    { id, editKey, data, updatedAt: Date.now() },
    ...list.filter((c) => c.id !== id && c.id !== cardId),
  ]);
  setCardId(id);
  return id;
}, [cardId, cards, data]);

  const openCard = useCallback(
    (id) => {
      const card = cards.find((c) => c.id === id);
      if (!card) return;
      setData({ ...defaultWeddingData, ...card.data });
      setCardId(id);
    },
    [cards]
  );

  const deleteCard = useCallback(
    (id) => {
      setCards((list) => list.filter((c) => c.id !== id));
      if (id === cardId) setCardId(null);
    },
    [cardId]
  );

  const startNew = useCallback(() => {
    setData(defaultWeddingData);
    setCardId(null);
  }, []);

  return (
    <InvitationContext.Provider
      value={{ template, data, cards, selectTemplate, updateData, saveCard, openCard, deleteCard, startNew }}
    >
      {children}
    </InvitationContext.Provider>
  );
}

export function useInvitation() {
  const ctx = useContext(InvitationContext);
  if (!ctx) throw new Error('useInvitation must be used within InvitationProvider');
  return ctx;
}