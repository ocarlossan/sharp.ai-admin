// URL do backend — definida em build via VITE_API_URL no EasyPanel.
export const API_URL =
  (import.meta as any).env?.VITE_API_URL ||
  'https://apps-sharp-ai-backend.jyo3rb.easypanel.host/api';

const TOKEN_KEY = 'sharp_admin_token';

export const token = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export async function api<T = any>(
  path: string,
  options: { method?: string; body?: any; auth?: boolean } = {},
): Promise<T> {
  const { method = 'GET', body, auth = true } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = token.get();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = Array.isArray(data?.message) ? data.message.join(', ') : data?.message || `Erro ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}
