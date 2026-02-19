import { BadgeConfig } from './types';

export const DEFAULT_BADGES: BadgeConfig[] = [
  {
    id: 'chefs-choice',
    label: "Chef's Choice",
    icon: '👨‍🍳',
    color: '#8B6914',
    enabled: true,
  },
  {
    id: 'recommended',
    label: 'Recommended',
    icon: '⭐',
    color: '#4A7C59',
    enabled: true,
  },
  {
    id: 'hot-deal',
    label: 'Hot Deal',
    icon: '🔥',
    color: '#C05A3C',
    enabled: true,
  },
  {
    id: 'most-popular',
    label: 'Most Popular',
    icon: '❤️',
    color: '#8B5E6B',
    enabled: true,
  },
  {
    id: 'new-item',
    label: 'New',
    icon: '✨',
    color: '#5A7C8B',
    enabled: true,
  },
];

export function getBadgeById(badges: BadgeConfig[], id: string): BadgeConfig | undefined {
  return badges.find((b) => b.id === id && b.enabled);
}

export function getActiveBadgesOnMenu(
  badges: BadgeConfig[],
  categories: { items: { badge?: string }[] }[],
  specials?: { items: { badge?: string }[] }
): BadgeConfig[] {
  const usedIds = new Set<string>();

  for (const cat of categories) {
    for (const item of cat.items) {
      if (item.badge) usedIds.add(item.badge);
    }
  }

  if (specials) {
    for (const item of specials.items) {
      if (item.badge) usedIds.add(item.badge);
    }
  }

  return badges.filter((b) => b.enabled && usedIds.has(b.id));
}
