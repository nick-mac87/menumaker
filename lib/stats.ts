import { StatEventType, MenuStats } from './types';

function getStorageKey(menuId: string): string {
  return `menumaker_stats_${menuId}`;
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0]; // "2024-01-15"
}

export function getStats(menuId: string): MenuStats {
  if (typeof window === 'undefined') return { totals: {}, daily: {} };
  try {
    const data = localStorage.getItem(getStorageKey(menuId));
    return data ? JSON.parse(data) : { totals: {}, daily: {} };
  } catch {
    return { totals: {}, daily: {} };
  }
}

export function recordEvent(menuId: string, eventType: StatEventType): void {
  if (typeof window === 'undefined') return;
  const stats = getStats(menuId);
  const today = getTodayKey();

  // Increment total
  stats.totals[eventType] = (stats.totals[eventType] || 0) + 1;

  // Increment daily
  if (!stats.daily[today]) {
    stats.daily[today] = {};
  }
  stats.daily[today][eventType] = (stats.daily[today][eventType] || 0) + 1;

  localStorage.setItem(getStorageKey(menuId), JSON.stringify(stats));
}

export function resetStats(menuId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(getStorageKey(menuId));
}

export function getStatTotal(menuId: string, eventType: StatEventType): number {
  const stats = getStats(menuId);
  return stats.totals[eventType] || 0;
}

export function getTodayStats(menuId: string): Record<string, number> {
  const stats = getStats(menuId);
  return stats.daily[getTodayKey()] || {};
}

export function getLast7DaysTotal(menuId: string, eventType: StatEventType): number {
  const stats = getStats(menuId);
  const now = new Date();
  let total = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    total += stats.daily[key]?.[eventType] || 0;
  }
  return total;
}

export function getLast7DaysSeries(menuId: string, eventType: StatEventType): { date: string; count: number }[] {
  const stats = getStats(menuId);
  const now = new Date();
  const series: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    series.push({
      date: d.toLocaleDateString('en', { weekday: 'short' }),
      count: stats.daily[key]?.[eventType] || 0,
    });
  }
  return series;
}
