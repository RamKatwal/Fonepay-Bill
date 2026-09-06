import { useCallback, useMemo, useState } from 'react';
import { useAppContext } from '@/store/AppContext';
import {
  DashboardPeriod,
  PeriodDelta,
  RangeSummary,
  ResolvedPeriod,
  computeDelta,
  resolvePeriod,
  summarizeRange,
} from '@/utils/salesPeriods';

export interface DashboardSummary extends RangeSummary {
  period: DashboardPeriod;
  resolved: ResolvedPeriod;
  delta: PeriodDelta;
}

/**
 * Owns the dashboard's selected reporting period and derives everything the
 * summary card renders: range totals and the comparison against the previous
 * equivalent period. The transaction data model is unchanged — this only
 * slices it differently.
 */
export function useDashboardSummary() {
  const { transactions } = useAppContext();
  const [period, setPeriod] = useState<DashboardPeriod>({ kind: 'today' });

  const selectPeriod = useCallback((next: DashboardPeriod) => setPeriod(next), []);

  const summary = useMemo<DashboardSummary>(() => {
    const now = new Date();
    const resolved = resolvePeriod(period, now);
    const current = summarizeRange(transactions, resolved.start, resolved.end);
    const previous = summarizeRange(transactions, resolved.prevStart, resolved.prevEnd);
    const delta = computeDelta(current.totalVolume, previous.totalVolume, resolved.comparedTo);

    return { ...current, period, resolved, delta };
  }, [transactions, period]);

  return { period, setPeriod: selectPeriod, summary };
}
