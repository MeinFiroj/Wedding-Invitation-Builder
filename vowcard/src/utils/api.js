const API = import.meta.env.VITE_API_URL;

async function call(path, options) {
  const res = await fetch(`${API}/api/cards${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

export const createCard = (data) => call('', { method: 'POST', body: JSON.stringify({ data }) });
export const updateCard = (id, data, editKey) =>
  call(`/${id}`, { method: 'PUT', body: JSON.stringify({ data, editKey }) });
export const fetchCard = (id) => call(`/${id}`);