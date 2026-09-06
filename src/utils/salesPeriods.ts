import { Transaction } from '@/types/transaction';
import { getCurrentDateFormatted } from '@/utils/invoice';

/**
 * Date-range maths for the dashboard "Today" section. Everything works on
 * `YYYY-MM-DD` strings (which sort lexicographically), so range checks are plain
 * string comparisons against `Transaction.date`.
 */

export type DashboardPeriodKind = 'today' | 'yesterday' | 'week' | 'month' | 'custom';

export interface DashboardPeriod {
  kind: DashboardPeriodKind;
  /** Inclusive `YYYY-MM-DD` bounds — only used when `kind` is `custom`. */
  start?: string;
  end?: string;
}

export interface PeriodPresetOption {
  kind: Exclude<DashboardPeriodKind, 'custom'>;
  label: string;
}

/** The presets offered in the period dropdown (Custom is appended separately). */
export const PERIOD_PRESETS: PeriodPresetOption[] = [
  { kind: 'today', label: 'Today' },
  { kind: 'yesterday', label: 'Yesterday' },
  { kind: 'week', label: 'This week' },
  { kind: 'month', label: 'This month' },
];

export interface ResolvedPeriod {
  /** Inclusive range currently shown. */
  start: string;
  end: string;
  /** The previous equivalent range, for the comparison delta. */
  prevStart: string;
  prevEnd: string;
  /** Uppercase heading, e.g. "TODAY", "THIS WEEK", "1 SEP – 6 SEP". */
  heading: string;
  /** Trailing phrase for the delta line, e.g. "yesterday", "last week". */
  comparedTo: string;
}

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const atMidnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const shift = (d: Date, days: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
const iso = (d: Date) => getCurrentDateFormatted(d);

/** Parse a `YYYY-MM-DD` string into a local Date at midnight. */
export function parsePeriodISO(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return atMidnight(new Date());
  return new Date(y, m - 1, d);
}

const prettyDay = (d: Date) => `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;

/** Inclusive day count between two `YYYY-MM-DD` strings. */
export function daysInclusive(startISO: string, endISO: string): number {
  const a = parsePeriodISO(startISO).getTime();
  const b = parsePeriodISO(endISO).getTime();
  return Math.round((b - a) / 86_400_000) + 1;
}

export function resolvePeriod(
  period: DashboardPeriod,
  now: Date = new Date()
): ResolvedPeriod {
  const today = atMidnight(now);

  switch (period.kind) {
    case 'yesterday': {
      const s = iso(shift(today, -1));
      const p = iso(shift(today, -2));
      return { start: s, end: s, prevStart: p, prevEnd: p, heading: 'YESTERDAY', comparedTo: 'the day before' };
    }

    case 'week': {
      const start = shift(today, -today.getDay()); // week starts Sunday
      return {
        start: iso(start),
        end: iso(today),
        prevStart: iso(shift(start, -7)),
        prevEnd: iso(shift(today, -7)),
        heading: 'THIS WEEK',
        comparedTo: 'last week',
      };
    }

    case 'month': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const elapsed = today.getDate() - 1;
      const prevStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      const prevEnd = new Date(
        prevStart.getFullYear(),
        prevStart.getMonth(),
        Math.min(1 + elapsed, prevMonthLastDay)
      );
      return {
        start: iso(start),
        end: iso(today),
        prevStart: iso(prevStart),
        prevEnd: iso(prevEnd),
        heading: 'THIS MONTH',
        comparedTo: 'last month',
      };
    }

    case 'custom': {
      const startISO = period.start ?? iso(today);
      const endISO = period.end ?? startISO;
      const span = daysInclusive(startISO, endISO);
      const startDate = parsePeriodISO(startISO);
      const endDate = parsePeriodISO(endISO);
      const prevEndDate = shift(startDate, -1);
      const prevStartDate = shift(prevEndDate, -(span - 1));
      const heading =
        startISO === endISO
          ? prettyDay(startDate).toUpperCase()
          : `${prettyDay(startDate)} – ${prettyDay(endDate)}`.toUpperCase();
      return {
        start: startISO,
        end: endISO,
        prevStart: iso(prevStartDate),
        prevEnd: iso(prevEndDate),
        heading,
        comparedTo: 'the period before',
      };
    }

    case 'today':
    default: {
      const s = iso(today);
      const p = iso(shift(today, -1));
      return { start: s, end: s, prevStart: p, prevEnd: p, heading: 'TODAY', comparedTo: 'yesterday' };
    }
  }
}

export interface RangeSummary {
  totalVolume: number;
  totalSalesCount: number;
  fonepayVolume: number;
  cashVolume: number;
}

/**
 * Totals for an inclusive date range. `totalSalesCount` counts every bill in the
 * range (matching the previous "Today" behaviour); the money figures only count
 * bills marked paid.
 */
export function summarizeRange(
  transactions: Transaction[],
  startISO: string,
  endISO: string
): RangeSummary {
  let totalVolume = 0;
  let totalSalesCount = 0;
  let fonepayVolume = 0;
  let cashVolume = 0;

  for (const tx of transactions) {
    if (tx.date < startISO || tx.date > endISO) continue;
    totalSalesCount += 1;
    if (tx.paymentStatus !== 'paid') continue;
    totalVolume += tx.amount;
    if (tx.paymentMode === 'fonepay') fonepayVolume += tx.amount;
    else if (tx.paymentMode === 'cash') cashVolume += tx.amount;
  }

  return { totalVolume, totalSalesCount, fonepayVolume, cashVolume };
}

export interface PeriodDelta {
  /** Percent change vs the previous period; null when there's no prior baseline. */
  pct: number | null;
  direction: 'up' | 'down' | 'flat';
  currentVolume: number;
  prevVolume: number;
  comparedTo: string;
}

export function computeDelta(
  currentVolume: number,
  prevVolume: number,
  comparedTo: string
): PeriodDelta {
  const direction =
    currentVolume > prevVolume ? 'up' : currentVolume < prevVolume ? 'down' : 'flat';
  const pct = prevVolume > 0 ? ((currentVolume - prevVolume) / prevVolume) * 100 : null;
  return { pct, direction, currentVolume, prevVolume, comparedTo };
}
