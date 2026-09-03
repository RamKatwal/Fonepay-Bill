import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Merchant } from '@/types/merchant';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { typography } from '@/constants/typography';

export interface MerchantInfoCardProps {
  merchant: Merchant;
  compact?: boolean;
  style?: ViewStyle;
}

/**
 * MerchantInfoCard
 * Read-only information presentation that explicitly communicates:
 * "This information comes from Fonepay."
 */
export function MerchantInfoCard({
  merchant,
  compact = false,
  style,
}: MerchantInfoCardProps) {
  return (
    <Card variant="surface" padding="md" style={style}>
      {/* Read-Only Source Banner */}
      <View style={styles.sourceBanner}>
        <View style={styles.verifiedRow}>
          <Icon name="shield-checkmark" size={14} color={colors.brand.primary} />
          <Text style={styles.sourceText}>Fonepay Verified Merchant</Text>
        </View>
        <View style={styles.lockBadge}>
          <Icon name="lock-closed" size={11} color={colors.text.muted} />
          <Text style={styles.lockText}>Read-only</Text>
        </View>
      </View>

      {/* Main Merchant Info */}
      <View style={styles.mainRow}>
        <View style={styles.iconBox}>
          <Icon name="storefront-outline" size={24} color={colors.brand.primary} />
        </View>
        <View style={styles.merchantDetails}>
          <Text style={styles.businessName}>{merchant.businessName}</Text>
          <View style={styles.panRow}>
            <Text style={styles.panLabel}>PAN / VAT:</Text>
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

const styles = StyleSheet.create({
  sourceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sourceText: {
    ...typography.label,
    fontSize: 11,
    color: colors.brand.primary,
    letterSpacing: 0.3,
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.subtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.small,
    gap: 3,
  },
  lockText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.text.muted,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: radius.medium,
    backgroundColor: colors.brand.muted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.brand.subtle,
  },
  merchantDetails: {
    flex: 1,
  },
  businessName: {
    ...typography.cardTitle,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
  },
  panRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  panLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  panValue: {
    ...typography.invoiceNumber,
    fontSize: 12,
    color: colors.text.primary,
  },
  secondarySection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
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
    color: colors.text.muted,
    marginBottom: 2,
  },
  metaValue: {
    ...typography.bodySmall,
    fontWeight: '500',
    color: colors.text.secondary,
  },
});
