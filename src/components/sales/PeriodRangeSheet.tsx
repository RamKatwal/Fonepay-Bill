import { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Chip } from '@/components/ui/Chip';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { makeStyles, useTheme } from '@/theme';
import { getCurrentDateFormatted } from '@/utils/invoice';
import { parsePeriodISO } from '@/utils/salesPeriods';
import { lightTick } from '@/utils/haptics';

interface PeriodRangeSheetProps {
  visible: boolean;
  onClose: () => void;
  initialStart?: string;
  initialEnd?: string;
  /** Called with an inclusive `YYYY-MM-DD` range. */
  onApply: (startISO: string, endISO: string) => void;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const iso = (d: Date) => getCurrentDateFormatted(d);
const shiftDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/**
 * Two-tap date-range picker for the dashboard's "Custom range" period. First tap
 * sets the start, second sets the end (taps before the start swap the two).
 * Future dates are disabled — reporting only looks backwards.
 */
export function PeriodRangeSheet({
  visible,
  onClose,
  initialStart,
  initialEnd,
  onApply,
}: PeriodRangeSheetProps) {
  const styles = useStyles();
  const t = useTheme();

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayISO = iso(today);

  const [rangeStart, setRangeStart] = useState<string | null>(initialStart ?? null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(initialEnd ?? null);
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(parsePeriodISO(initialEnd ?? initialStart ?? todayISO))
  );

  // Re-seed each time the sheet opens.
  const [lastVisible, setLastVisible] = useState(visible);
  if (visible !== lastVisible) {
    setLastVisible(visible);
    if (visible) {
      setRangeStart(initialStart ?? null);
      setRangeEnd(initialEnd ?? null);
      setViewMonth(startOfMonth(parsePeriodISO(initialEnd ?? initialStart ?? todayISO)));
    }
  }

  const canGoNext =
    viewMonth.getFullYear() < today.getFullYear() ||
    (viewMonth.getFullYear() === today.getFullYear() &&
      viewMonth.getMonth() < today.getMonth());

  const cells = useMemo(() => {
    const first = startOfMonth(viewMonth);
    const leading = first.getDay();
    const daysInMonth = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth() + 1,
      0
    ).getDate();

    const out: (Date | null)[] = [];
    for (let i = 0; i < leading; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      out.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
    }
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [viewMonth]);

  const pickDay = (dISO: string) => {
    lightTick();
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(dISO);
      setRangeEnd(null);
      return;
    }
    if (dISO < rangeStart) {
      setRangeEnd(rangeStart);
      setRangeStart(dISO);
    } else {
      setRangeEnd(dISO);
    }
  };

  const applyQuick = (days: number) => {
    lightTick();
    const start = iso(shiftDays(today, -(days - 1)));
    onApply(start, todayISO);
    onClose();
  };

  const apply = () => {
    if (!rangeStart) return;
    onApply(rangeStart, rangeEnd ?? rangeStart);
    onClose();
  };

  const summaryText = rangeStart
    ? rangeEnd && rangeEnd !== rangeStart
      ? `${rangeStart}  →  ${rangeEnd}`
      : `${rangeStart}  ·  pick an end date`
    : 'Pick a start date';

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Custom range">
      <View style={styles.calendar}>
        <View style={styles.quickRow}>
          <Chip label="Last 7 days" size="sm" onPress={() => applyQuick(7)} />
          <Chip label="Last 30 days" size="sm" onPress={() => applyQuick(30)} />
        </View>

        <View style={styles.header}>
          <Pressable
            onPress={() => setViewMonth(addMonths(viewMonth, -1))}
            hitSlop={10}
            style={styles.navBtn}
            accessibilityLabel="Previous month">
            <Icon name="chevron-back" size={20} color={t.text.primary} />
          </Pressable>
          <Text style={styles.monthLabel}>
            {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
          </Text>
          <Pressable
            onPress={() => canGoNext && setViewMonth(addMonths(viewMonth, 1))}
            disabled={!canGoNext}
            hitSlop={10}
            style={styles.navBtn}
            accessibilityLabel="Next month">
            <Icon
              name="chevron-forward"
              size={20}
              color={canGoNext ? t.text.primary : t.text.muted}
            />
          </Pressable>
        </View>

        <View style={styles.weekRow}>
          {WEEKDAYS.map((w, i) => (
            <Text key={i} style={styles.weekday}>
              {w}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {cells.map((date, i) => {
            if (!date) return <View key={i} style={styles.cell} />;

            const dISO = iso(date);
            const future = dISO > todayISO;
            const isStart = dISO === rangeStart;
            const isEnd = dISO === rangeEnd;
            const inRange =
              !!rangeStart &&
              !!rangeEnd &&
              dISO > rangeStart &&
              dISO < rangeEnd;
            const isEndpoint = isStart || isEnd;

            return (
              <Pressable
                key={i}
                style={styles.cell}
                disabled={future}
                onPress={() => pickDay(dISO)}>
                <View
                  style={[
                    styles.dayInner,
                    inRange && styles.dayInnerRange,
                    isEndpoint && styles.dayInnerEndpoint,
                  ]}>
                  <Text
                    style={[
                      styles.dayText,
                      future && styles.dayTextDisabled,
                      isEndpoint && styles.dayTextEndpoint,
                    ]}>
                    {date.getDate()}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.summary}>{summaryText}</Text>

        <Button
          title="Apply range"
          onPress={apply}
          disabled={!rangeStart}
          size="lg"
        />
      </View>
    </BottomSheet>
  );
}

const useStyles = makeStyles((t, type) => ({
  calendar: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    gap: spacing.sm,
  },
  quickRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  monthLabel: {
    ...type.cardTitle,
    color: t.text.primary,
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekday: {
    ...type.caption,
    flex: 1,
    textAlign: 'center',
    color: t.text.muted,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  dayInner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayInnerRange: {
    backgroundColor: t.background.subtle,
    borderRadius: 8,
  },
  dayInnerEndpoint: {
    backgroundColor: t.text.primary,
    borderRadius: 19,
  },
  dayText: {
    ...type.bodyMedium,
    color: t.text.primary,
    fontVariant: ['tabular-nums'],
  },
  dayTextDisabled: {
    color: t.text.muted,
    opacity: 0.5,
  },
  dayTextEndpoint: {
    color: t.background.surface,
    fontWeight: '700',
  },
  summary: {
    ...type.caption,
    textAlign: 'center',
    color: t.text.secondary,
    fontVariant: ['tabular-nums'],
    marginTop: spacing.xs,
  },
}));
