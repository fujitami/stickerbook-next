export const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });
  return res;
}
