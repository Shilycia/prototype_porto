const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://43.173.33.116:3001').replace(/\/+$/, '');

/** Fetch a public collection without allowing an unavailable API to delay rendering indefinitely. */
export async function getPublicCollection<T>(path: string): Promise<T[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return [];

    const data: unknown = await response.json();
    return Array.isArray(data) ? data as T[] : [];
  } catch {
    return [];
  }
}
