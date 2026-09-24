import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Returns a human-readable relative time string (no external lib required). */
export function formatDistanceToNow(date: Date): string {
  const now = Date.now();
  const diff = Math.floor((now - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return `${m}m ago`;
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return `${h}h ago`;
  }
  const d = Math.floor(diff / 86400);
  if (d === 1) return 'yesterday';
  if (d < 7) return `${d}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
