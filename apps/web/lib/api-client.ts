const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type RequestOptions = RequestInit & {
  token?: string | null;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: options.cache ?? "no-store"
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "API request failed");
  }

  return (await response.json()) as T;
}
