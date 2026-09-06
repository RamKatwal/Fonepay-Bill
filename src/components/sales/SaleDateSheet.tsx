import { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Icon } from '@/components/ui/Icon';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { makeStyles, useTheme } from '@/theme';
import { getCurrentDateFormatted } from '@/utils/invoice';
import { lightTick } from '@/utils/haptics';

interface SaleDateSheetProps {
  visible: boolean;
  onClose: () => void;
  /** Currently selected date, YYYY-MM-DD. */
  value: string;
  /** Called with the chosen date (YYYY-MM-DD). */
  onSelect: (dateISO: string) => void;
  title?: string;
  /** Optional clear action (e.g. history “all dates”). */
  onClear?: () => void;
  clearLabel?: string;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Parse a YYYY-MM-DD string into a local Date (midnight). */
function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return new Date();
  return new Date(y, m - 1, d);
}

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const addMonths = (date: Date, n: number) =>
  new Date(date.getFullYear(), date.getMonth() + n, 1);
const sameISO = (a: Date, b: Date) =>
  getCurrentDateFormatted(a) === getCurrentDateFormatted(b);

/**
 * A minimal month calendar in a bottom sheet. Future dates are disabled — a
 * sale can only be dated today or in the past.
 */
export function SaleDateSheet({
  visible,
  onClose,
  value,
  onSelect,
  title = 'Sale date',
  onClear,
  clearLabel = 'Show all dates',
}: SaleDateSheetProps) {
  const styles = useStyles();
  const t = useTheme();

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const selected = useMemo(() => parseISO(value), [value]);

  const [viewMonth, setViewMonth] = useState(() => startOfMonth(selected));

  // Re-anchor to the selected month each time the sheet opens.
  const [lastVisible, setLastVisible] = useState(visible);
  if (visible !== lastVisible) {
    setLastVisible(visible);
    if (visible) setViewMonth(startOfMonth(selected));
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

  const pick = (date: Date) => {
    lightTick();
    onSelect(getCurrentDateFormatted(date));
    onClose();
  };

  const isToday = sameISO(selected, today);

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      <View style={styles.calendar}>
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

          const future = getCurrentDateFormatted(date) > getCurrentDateFormatted(today);
          const isSel = sameISO(date, selected);
          const isCurrentDay = sameISO(date, today);

          return (
            <Pressable
              key={i}
              style={styles.cell}
              disabled={future}
              onPress={() => pick(date)}>
              <View style={[styles.dayInner, isSel && styles.dayInnerSelected]}>
                <Text
                  style={[
                    styles.dayText,
                    future && styles.dayTextDisabled,
                    isSel && styles.dayTextSelected,
                    !isSel && isCurrentDay && styles.dayTextToday,
                  ]}>
                  {date.getDate()}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {!isToday && (
        <Pressable
          onPress={() => pick(today)}
          style={styles.todayBtn}
          accessibilityRole="button">
          <Text style={styles.todayBtnText}>Jump to today</Text>
        </Pressable>
      )}

      {onClear && (
        <Pressable
          onPress={() => {
            lightTick();
            onClear();
            onClose();
          }}
          style={styles.todayBtn}
          accessibilityRole="button">
          <Text style={styles.clearBtnText}>{clearLabel}</Text>
        </Pressable>
      )}
      </View>
    </BottomSheet>
  );
}

const useStyles = makeStyles((t, type) => ({
  calendar: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
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
    marginTop: spacing.sm,
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
  dayInnerSelected: {
    backgroundColor: t.text.primary,
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
  dayTextSelected: {
    color: t.background.surface,
    fontWeight: '700',
  },
  dayTextToday: {
    color: t.brand.primary,
    fontWeight: '700',
  },
  todayBtn: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
  },
  todayBtnText: {
    ...type.bodyMedium,
    fontWeight: '700',
    color: t.brand.primary,
  },
  clearBtnText: {
    ...type.bodyMedium,
    fontWeight: '600',
    color: t.text.secondary,
    textDecorationLine: 'underline',
  },
}));
