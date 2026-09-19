export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://43.173.33.116:3001').replace(/\/+$/, '');

  // Auto-rewrite localhost/emulator URLs to current API server
  if (
    trimmed.startsWith('http://localhost:3001') ||
    trimmed.startsWith('https://localhost:3001') ||
    trimmed.startsWith('http://127.0.0.1:3001') ||
    trimmed.startsWith('http://10.0.2.2:3001')
  ) {
    return trimmed.replace(/^https?:\/\/[^/]+/, apiBase);
  }

  // Rewrite relative paths
  if (trimmed.startsWith('/uploads/')) {
    return `${apiBase}${trimmed}`;
  }

  return trimmed;
}
