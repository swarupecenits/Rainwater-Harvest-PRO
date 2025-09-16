export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

interface FetchOptions extends RequestInit {
  auth?: boolean;
}

interface MessageObj { message: string }
function isMessageObj(value: unknown): value is MessageObj {
  if (typeof value !== 'object' || value === null) return false;
  if (!('message' in value)) return false;
  const v = (value as Record<string, unknown>).message;
  return typeof v === 'string';
}

// Generic API fetch helper with optional auth header.
// T defaults to unknown to avoid implicit any.
export async function apiFetch<T = unknown>(path: string, { auth = true, headers, ...rest }: FetchOptions = {}): Promise<T> {
  const token = auth ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}` , {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    }
  });
  if (!res.ok) {
    let message = `Request failed with ${res.status}`;
    try {
      const data: unknown = await res.json();
      if (isMessageObj(data)) {
        message = data.message;
      }
    } catch (err) {
      // swallow JSON parse error, keep default message
    }
    throw new Error(message);
  }
  try {
    return await res.json() as T;
  } catch {
    // No JSON body
    return undefined as T;
  }
}
