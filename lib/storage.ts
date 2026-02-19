import { Menu } from './types';

const STORAGE_KEY = 'menumaker_menus';
const DRAFT_KEY = 'menumaker_draft';

export function getAllMenus(): Record<string, Menu> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function getMenu(id: string): Menu | null {
  const menus = getAllMenus();
  return menus[id] || null;
}

export function saveMenu(menu: Menu): void {
  if (typeof window === 'undefined') return;
  const menus = getAllMenus();
  menus[menu.id] = { ...menu, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(menus));
}

export function deleteMenu(id: string): void {
  if (typeof window === 'undefined') return;
  const menus = getAllMenus();
  delete menus[id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(menus));
}

export function saveDraft(menu: Partial<Menu>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DRAFT_KEY, JSON.stringify(menu));
}

export function getDraft(): Partial<Menu> | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(DRAFT_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DRAFT_KEY);
}

export function exportMenuAsJson(menu: Menu): string {
  return JSON.stringify(menu, null, 2);
}

export function importMenuFromJson(json: string): Menu | null {
  try {
    const menu = JSON.parse(json);
    if (menu.id && menu.restaurant && menu.categories) {
      return menu as Menu;
    }
    return null;
  } catch {
    return null;
  }
}
