import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  if (seconds < 90) {
    return `${seconds} sec`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} min${remainingSeconds ? ` ${remainingSeconds} sec` : ''}`;
}

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatPerformance(
  value: number | null | undefined,
  mode: string,
  unit: string,
): string {
  if (value === undefined || value === null || value === 0) return '—';

  switch (mode.toLowerCase()) {
    case 'reps':
      return `${value} reps`;
    case 'time':
      return formatDuration(value);
    case 'distance':
      return value >= 1000 ? `${(value / 1000).toFixed(2)}km` : `${value}m`;
    case 'weight':
      return `${value}${unit}`;
    default:
      return `${value}${unit}`;
  }
}

export function calculateImprovement(current: number, previous: number | null): number {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}
