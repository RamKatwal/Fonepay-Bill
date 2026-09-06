import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  loadItemHistory,
  saveItemHistory,
  upsertEntry,
  type ItemHistoryEntry,
} from '@/data/itemHistory';
import { fuzzyScore } from '@/utils/fuzzyMatch';

interface ItemHistoryContextType {
  entries: ItemHistoryEntry[];
  /** Upsert an item + price into history (fire-and-forget persist). */
  recordItem: (name: string, price: number) => void;
  /** Ranked type-ahead matches for the current query. */
  suggest: (query: string, limit?: number) => ItemHistoryEntry[];
  /** Most commonly / recently used items for quick-pick chips. */
  popular: (limit?: number) => ItemHistoryEntry[];
}

const ItemHistoryContext = createContext<ItemHistoryContextType | undefined>(undefined);

const DAY_MS = 24 * 60 * 60 * 1000;

/** Blend match quality with how often / how recently the item was used. */
function rankScore(entry: ItemHistoryEntry, matchScore: number): number {
  const frequency = Math.log(entry.timesUsed + 1);
  const ageDays = entry.lastUsedAt > 0 ? (Date.now() - entry.lastUsedAt) / DAY_MS : 999;
  const recency = entry.lastUsedAt > 0 ? Math.max(0, 1 - ageDays / 30) : 0;
  return matchScore + frequency * 6 + recency * 12;
}

export function ItemHistoryProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<ItemHistoryEntry[]>([]);
  const entriesRef = useRef(entries);
  entriesRef.current = entries;

  useEffect(() => {
    let active = true;
    loadItemHistory().then((loaded) => {
      if (active) setEntries(loaded);
    });
    return () => {
      active = false;
    };
  }, []);

  const recordItem = useCallback((name: string, price: number) => {
    const next = upsertEntry(entriesRef.current, name, price);
    setEntries(next);
    void saveItemHistory(next);
  }, []);

  const suggest = useCallback(
    (query: string, limit = 6): ItemHistoryEntry[] => {
      const q = query.trim();
      if (!q) return [];
      return entries
        .map((entry) => ({ entry, match: fuzzyScore(q, entry.name) }))
        .filter((row) => row.match > 0)
        .sort((a, b) => rankScore(b.entry, b.match) - rankScore(a.entry, a.match))
        .slice(0, limit)
        .map((row) => row.entry);
    },
    [entries]
  );

  const popular = useCallback(
    (limit = 6): ItemHistoryEntry[] => {
      return [...entries]
        .sort((a, b) => {
          const byRank = rankScore(b, 0) - rankScore(a, 0);
          if (byRank !== 0) return byRank;
          if (b.timesUsed !== a.timesUsed) return b.timesUsed - a.timesUsed;
          return b.lastUsedAt - a.lastUsedAt;
        })
        .slice(0, limit);
    },
    [entries]
  );

  const value = useMemo(
    () => ({ entries, recordItem, suggest, popular }),
    [entries, recordItem, suggest, popular]
  );

  return (
    <ItemHistoryContext.Provider value={value}>{children}</ItemHistoryContext.Provider>
  );
}

export function useItemHistory(): ItemHistoryContextType {
  const context = useContext(ItemHistoryContext);
  if (!context) {
    throw new Error('useItemHistory must be used within an ItemHistoryProvider');
  }
  return context;
}
