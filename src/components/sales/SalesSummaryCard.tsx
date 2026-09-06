import { useRef, useState } from 'react';
import { View, Text, Pressable, ViewStyle } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { DropdownMenu, AnchorRect, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { PeriodRangeSheet } from '@/components/sales/PeriodRangeSheet';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { makeStyles, useTheme } from '@/theme';
import { formatNPR } from '@/utils/currency';
import { lightTick } from '@/utils/haptics';
import {
  DashboardPeriod,
  DashboardPeriodKind,
  PERIOD_PRESETS,
} from '@/utils/salesPeriods';
import type { DashboardSummary } from '@/hooks/useDashboardSummary';

export interface SalesSummaryCardProps {
  summary: DashboardSummary;
  onChangePeriod: (period: DashboardPeriod) => void;
  style?: ViewStyle;
}

/**
 * Period-aware sales summary. Heading is a dropdown (Today / Yesterday /
 * This week / This month / Custom range); the hero total carries a comparison
 * against the previous equivalent period when there is something to compare.
 */
export function SalesSummaryCard({ summary, onChangePeriod, style }: SalesSummaryCardProps) {
  const styles = useStyles();
  const t = useTheme();

  const { totalVolume, totalSalesCount, fonepayVolume, cashVolume, delta } = summary;
  const { period, resolved } = summary;

  const anchorRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [rangeVisible, setRangeVisible] = useState(false);

  const openMenu = () => {
    const node = anchorRef.current;
    if (!node) return;
    node.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setMenuVisible(true);
    });
  };

  const menuItems: DropdownMenuItem[] = [
    ...PERIOD_PRESETS.map((p) => ({
      key: p.kind,
      label: p.label,
      selected: period.kind === p.kind,
    })),
    {
      key: 'custom',
      label: period.kind === 'custom' ? 'Change custom range…' : 'Custom range…',
      selected: period.kind === 'custom',
      divided: true,
    },
  ];

  const handleSelect = (key: string) => {
    setMenuVisible(false);
    lightTick();
    if (key === 'custom') {
      setRangeVisible(true);
      return;
    }
    onChangePeriod({ kind: key as DashboardPeriodKind });
  };

  const deltaColor =
    delta.direction === 'up'
      ? t.status.success
      : delta.direction === 'down'
        ? t.status.error
        : t.text.muted;

  const hasDelta = totalVolume > 0 || delta.pct !== null;
  const accentText =
    delta.pct !== null
      ? `${Math.abs(Math.round(delta.pct))}%`
      : totalVolume > 0
        ? `+${formatNPR(totalVolume)}`
        : '';
  const mutedText =
    delta.pct !== null
      ? `vs ${formatNPR(delta.prevVolume)} ${delta.comparedTo}`
      : totalVolume > 0
        ? `vs ${delta.comparedTo}`
        : '';

  const showBreakdown = fonepayVolume !== undefined || cashVolume !== undefined;

  return (
    <Card variant="elevated" padding="md" style={style}>
      <View style={styles.headRow}>
        <View style={styles.headLeft}>
          <View ref={anchorRef} collapsable={false} style={styles.anchor}>
            <Pressable
              onPress={openMenu}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Period: ${resolved.heading}. Tap to change.`}
              style={styles.periodBtn}>
              <Text style={styles.periodLabel}>{resolved.heading}</Text>
              <Icon name="chevron-down" size={13} color={t.text.muted} />
            </Pressable>
          </View>
          <Text style={styles.total}>{formatNPR(totalVolume)}</Text>
        </View>

        <View style={styles.billsChip}>
          <Icon name="receipt-outline" size={13} color={t.text.secondary} />
          <Text style={styles.billsText}>
            <Text style={styles.billsCount}>{totalSalesCount}</Text>
            {` ${totalSalesCount === 1 ? 'bill' : 'bills'}`}
          </Text>
        </View>
      </View>

      {hasDelta && (
        <View style={styles.deltaRow}>
          <Icon
            name={
              delta.direction === 'down'
                ? 'trending-down'
                : delta.direction === 'up'
                  ? 'trending-up'
                  : 'remove'
            }
            size={14}
            color={deltaColor}
          />
          {!!accentText && (
            <Text style={[styles.deltaAccent, { color: deltaColor }]}>{accentText}</Text>
          )}
          {!!mutedText && (
            <Text style={styles.deltaMuted} numberOfLines={1}>
              {mutedText}
            </Text>
          )}
        </View>
      )}

      {showBreakdown && (
        <View style={styles.panel}>
          <View style={styles.panelHalf}>
            <Text style={styles.panelLabel}>Fonepay QR</Text>
            <Text style={styles.panelValue}>{formatNPR(fonepayVolume ?? 0)}</Text>
          </View>
          <View style={styles.panelDivider} />
          <View style={styles.panelHalf}>
            <Text style={styles.panelLabel}>Cash</Text>
            <Text style={styles.panelValue}>{formatNPR(cashVolume ?? 0)}</Text>
          </View>
        </View>
      )}

      <DropdownMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        anchor={anchor}
        items={menuItems}
        onSelect={handleSelect}
      />

      <PeriodRangeSheet
        visible={rangeVisible}
        onClose={() => setRangeVisible(false)}
        initialStart={period.kind === 'custom' ? period.start : resolved.start}
        initialEnd={period.kind === 'custom' ? period.end : resolved.end}
        onApply={(start, end) => onChangePeriod({ kind: 'custom', start, end })}
      />
    </Card>
  );
}

const useStyles = makeStyles((t, type) => ({
  headRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headLeft: {
    flex: 1,
  },
  anchor: {
    alignSelf: 'flex-start',
  },
  periodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    marginBottom: 1,
  },
  periodLabel: {
    ...type.label,
    fontSize: 11,
    letterSpacing: 0.8,
    color: t.text.muted,
  },
  total: {
    ...type.display,
    color: t.text.primary,
  },
  billsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: t.background.subtle,
    marginBottom: 3,
  },
  billsText: {
    ...type.caption,
    color: t.text.secondary,
  },
  billsCount: {
    ...type.caption,
    fontWeight: '700',
    color: t.text.primary,
    fontVariant: ['tabular-nums'],
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
  },
  deltaAccent: {
    ...type.caption,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  deltaMuted: {
    ...type.caption,
    color: t.text.muted,
    flexShrink: 1,
  },
  panel: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: spacing.lg,
    borderRadius: radius.medium,
    backgroundColor: t.background.subtle,
    paddingVertical: spacing.md,
  },
  panelHalf: {
    flex: 1,
    paddingHorizontal: spacing.md,
    gap: 3,
  },
  panelDivider: {
    width: 1,
    backgroundColor: t.border.default,
  },
  panelLabel: {
    ...type.caption,
    fontSize: 11,
    color: t.text.secondary,
  },
  panelValue: {
    ...type.sectionTitle,
    fontSize: 15,
    color: t.text.primary,
    fontVariant: ['tabular-nums'],
  },
}));
