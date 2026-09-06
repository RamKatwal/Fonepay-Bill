import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockProducts } from './mockProducts';

/**
 * A single remembered line item. The merchant's personal, per-device catalogue
 * — every "Add to sale" silently upserts into this list, and the item-name
 * type-ahead reads from it.
 */
export interface ItemHistoryEntry {
  name: string;
  lastPrice: number;
  timesUsed: number;
  lastUsedAt: number; // epoch ms; 0 for never-used seed entries
}

export const ITEM_HISTORY_KEY = 'quickbill:item-history:v1';

/** Initial history, derived from the demo product catalogue. */
export function seedFromCatalog(): ItemHistoryEntry[] {
  return mockProducts.map((p) => ({
    name: p.particulars,
    lastPrice: p.defaultRate,
    timesUsed: 0,
    lastUsedAt: 0,
  }));
}

function isValidEntry(value: unknown): value is ItemHistoryEntry {
  if (!value || typeof value !== 'object') return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.name === 'string' &&
    typeof e.lastPrice === 'number' &&
    typeof e.timesUsed === 'number' &&
    typeof e.lastUsedAt === 'number'
  );
}

/** Load persisted history, falling back to the catalogue seed on any problem. */
export async function loadItemHistory(): Promise<ItemHistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(ITEM_HISTORY_KEY);
    if (!raw) return seedFromCatalog();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const entries = parsed.filter(isValidEntry);
      if (entries.length > 0) return entries;
    }
    return seedFromCatalog();
  } catch {
    return seedFromCatalog();
  }
}

/** Persist history. Never throws. */
export async function saveItemHistory(entries: ItemHistoryEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ITEM_HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // Best effort — a failed write just means the suggestion isn't remembered.
  }
}

/**
 * Insert or update an entry by case-insensitive exact name. Returns a new array.
 */
export function upsertEntry(
  entries: ItemHistoryEntry[],
  name: string,
  price: number
): ItemHistoryEntry[] {
  const trimmed = name.trim();
  if (!trimmed) return entries;

  const key = trimmed.toLowerCase();
  const now = Date.now();
  let found = false;

  const next = entries.map((entry) => {
    if (entry.name.trim().toLowerCase() !== key) return entry;
    found = true;
    return {
      ...entry,
      name: trimmed,
      lastPrice: price > 0 ? price : entry.lastPrice,
      timesUsed: entry.timesUsed + 1,
      lastUsedAt: now,
    };
  });

  if (found) return next;

  return [
    { name: trimmed, lastPrice: price > 0 ? price : 0, timesUsed: 1, lastUsedAt: now },
    ...next,
  ];
}
