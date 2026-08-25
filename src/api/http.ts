export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8080";

function getToken(): string | null {
  try {
    const raw = localStorage.getItem("garage_auth_v1");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: string };
    return parsed.token ?? null;
  } catch {
    return null;
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) throw new UnauthorizedError();

  if (!res.ok) {
    const text = await res.text();
    if (text) {
      try {
        const payload = JSON.parse(text) as { message?: string; detail?: string; error?: string };
        throw new Error(payload.message || payload.detail || payload.error || text);
      } catch (error) {
        if (error instanceof SyntaxError) throw new Error(text);
        throw error;
      }
    }
    throw new Error(`Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
