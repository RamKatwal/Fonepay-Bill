import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Merchant } from '@/types/merchant';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { typography } from '@/constants/typography';
import { makeStyles, useTheme } from '@/theme';

export interface MerchantInfoCardProps {
  merchant: Merchant;
  compact?: boolean;
  style?: ViewStyle;
}

/**
 * MerchantInfoCard — read-only merchant identity sourced from Fonepay.
 */
export function MerchantInfoCard({
  merchant,
  compact = false,
  style,
}: MerchantInfoCardProps) {
  const styles = useStyles();
  const t = useTheme();

  return (
    <Card variant="surface" padding="md" style={style}>
      <View style={styles.sourceBanner}>
        <View style={styles.verifiedRow}>
          <Icon name="shield-checkmark-outline" size={14} color={t.text.secondary} />
          <Text style={styles.sourceText}>Fonepay verified merchant</Text>
        </View>
        <View style={styles.lockBadge}>
          <Icon name="lock-closed" size={11} color={t.text.muted} />
          <Text style={styles.lockText}>Read-only</Text>
        </View>
      </View>

      <View style={styles.mainRow}>
        <View style={styles.iconBox}>
          <Icon name="storefront-outline" size={22} color={t.text.secondary} />
        </View>
        <View style={styles.merchantDetails}>
          <Text style={styles.businessName}>{merchant.businessName}</Text>
          <View style={styles.panRow}>
            <Text style={styles.panLabel}>PAN / VAT</Text>
            <Text style={styles.panValue}>{merchant.panVatNumber}</Text>
          </View>
        </View>
      </View>

      {!compact && (
        <View style={styles.secondarySection}>
          <View style={styles.metadataGrid}>
            <View style={styles.metadataItem}>
              <Text style={styles.metaLabel}>Terminal ID</Text>
              <Text style={styles.metaValue}>{merchant.terminalId}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Text style={styles.metaLabel}>Contact</Text>
              <Text style={styles.metaValue}>{merchant.contactNumber}</Text>
            </View>
            <View style={[styles.metadataItem, styles.fullWidthItem]}>
              <Text style={styles.metaLabel}>Address</Text>
              <Text style={styles.metaValue}>{merchant.address}</Text>
            </View>
          </View>
        </View>
      )}
    </Card>
  );
}

const useStyles = makeStyles((t) => ({
  sourceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: t.border.subtle,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sourceText: {
    ...typography.label,
    color: t.text.secondary,
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  lockText: {
    ...typography.caption,
    fontSize: 10,
    color: t.text.muted,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.medium,
    backgroundColor: t.background.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  merchantDetails: {
    flex: 1,
  },
  businessName: {
    ...typography.cardTitle,
    fontSize: 16,
    color: t.text.primary,
  },
  panRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  panLabel: {
    ...typography.caption,
    color: t.text.muted,
  },
  panValue: {
    ...typography.invoiceNumber,
    fontSize: 12,
    color: t.text.secondary,
  },
  secondarySection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: t.border.subtle,
  },
  metadataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metadataItem: {
    flex: 1,
    minWidth: 120,
  },
  fullWidthItem: {
    width: '100%',
    flexBasis: '100%',
  },
  metaLabel: {
    ...typography.caption,
    color: t.text.muted,
    marginBottom: 2,
  },
  metaValue: {
    ...typography.bodySmall,
    fontWeight: '500',
    color: t.text.secondary,
  },
}));
