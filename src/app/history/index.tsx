import React, { useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTransactions } from '@/hooks/useTransactions';
import { Screen } from '@/components/layout/Screen';
import { Chip } from '@/components/ui/Chip';
import { IconButton } from '@/components/ui/IconButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { TransactionCard } from '@/components/history/TransactionCard';
import { DropdownMenu, AnchorRect, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { PeriodRangeSheet } from '@/components/sales/PeriodRangeSheet';
import { Spacing } from '@/constants/spacing';
import { makeStyles, useTheme } from '@/theme';
import { PaymentMode } from '@/types/payment';
import { lightTick } from '@/utils/haptics';
import {
  DashboardPeriod,
  DashboardPeriodKind,
  PERIOD_PRESETS,
  resolvePeriod,
} from '@/utils/salesPeriods';

export default function SalesHistoryScreen() {
  const router = useRouter();
  const styles = useStyles();
  const t = useTheme();
  const { allTransactions } = useTransactions();

  const [modeFilter, setModeFilter] = useState<PaymentMode | 'all'>('all');
  const [period, setPeriod] = useState<DashboardPeriod | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [rangeVisible, setRangeVisible] = useState(false);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const calendarRef = useRef<View>(null);

  const resolved = useMemo(
    () => (period ? resolvePeriod(period) : null),
    [period]
  );

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      if (modeFilter !== 'all' && tx.paymentMode !== modeFilter) return false;
      if (resolved) {
        if (tx.date < resolved.start || tx.date > resolved.end) return false;
      }
      return true;
    });
  }, [allTransactions, modeFilter, resolved]);

  const openPeriodMenu = () => {
    const node = calendarRef.current;
    if (!node) {
      setRangeVisible(true);
      return;
    }
    node.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setMenuVisible(true);
    });
  };

  const menuItems: DropdownMenuItem[] = [
    ...PERIOD_PRESETS.map((p) => ({
      key: p.kind,
      label: p.label,
      selected: period?.kind === p.kind,
    })),
    {
      key: 'custom',
      label: period?.kind === 'custom' ? 'Change custom range…' : 'Custom range…',
      selected: period?.kind === 'custom',
      divided: true,
    },
    ...(period
      ? [
          {
            key: 'clear',
            label: 'Clear date filter',
            selected: false,
            divided: true,
          },
        ]
      : []),
  ];

  const handleSelect = (key: string) => {
    setMenuVisible(false);
    lightTick();
    if (key === 'clear') {
      setPeriod(null);
      return;
    }
    if (key === 'custom') {
      setRangeVisible(true);
      return;
    }
    setPeriod({ kind: key as DashboardPeriodKind });
  };

  const handleOpenTransaction = (id: string) => {
    router.push(`/history/${id}` as any);
  };

  const filters: { key: PaymentMode | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'fonepay', label: 'Fonepay' },
    { key: 'cash', label: 'Cash' },
  ];

  const countLabel =
    filteredTransactions.length === 1
      ? '1 transaction'
      : `${filteredTransactions.length} transactions`;

  const subtitle = resolved
    ? `${resolved.heading} · ${countLabel}`
    : countLabel;

  return (
    <Screen
      headerProps={{
        title: 'Sales history',
        subtitle,
        showBack: true,
        rightAction: (
          <View ref={calendarRef} collapsable={false}>
            <IconButton
              icon="calendar-outline"
              onPress={openPeriodMenu}
              size={40}
              iconSize={22}
              color={period ? t.brand.primary : t.text.primary}
              accessibilityLabel="Filter by date"
            />
          </View>
        ),
      }}>
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <Chip
            key={f.key}
            label={f.label}
            size="sm"
            selected={modeFilter === f.key}
            onPress={() => setModeFilter(f.key)}
          />
        ))}
      </View>

      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title="No transactions found"
          description="There are no sales matching the selected filter."
        />
      ) : (
        <View style={styles.txList}>
          {filteredTransactions.map((tx) => (
            <TransactionCard
              key={tx.id}
              transaction={tx}
              onPress={() => handleOpenTransaction(tx.id)}
            />
          ))}
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
        initialStart={period?.kind === 'custom' ? period.start : resolved?.start}
        initialEnd={period?.kind === 'custom' ? period.end : resolved?.end}
        onApply={(start, end) => setPeriod({ kind: 'custom', start, end })}
      />
    </Screen>
  );
}

const useStyles = makeStyles(() => ({
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  txList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
}));
