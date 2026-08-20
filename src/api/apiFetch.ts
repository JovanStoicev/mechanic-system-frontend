export async function apiFetch(
  path: string,
  opts: RequestInit & { token?: string } = {},
) {
  const { token, headers, ...rest } = opts;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return res;
}
import { API_BASE_URL } from "./http";
