import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/store/AppContext';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Chip } from '@/components/ui/Chip';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { typography, Typography } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { makeStyles, useTheme, useThemeMode, type ThemeMode } from '@/theme';
import { formatPAN } from '@/utils/formatters';

const APPEARANCE_OPTIONS: { key: ThemeMode; label: string }[] = [
  { key: 'system', label: 'System' },
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
];

export default function MerchantProfileScreen() {
  const router = useRouter();
  const styles = useStyles();
  const t = useTheme();
  const { merchant, logout } = useAppContext();
  const { mode, setMode } = useThemeMode();

  const handleResetPrototype = () => {
    logout();
    router.replace('/');
  };

  return (
    <Screen
      headerProps={{
        title: 'Profile',
        showBack: true,
      }}
      footer={
        <Button
          title="Reset prototype"
          onPress={handleResetPrototype}
          variant="outline"
          size="md"
          leftIcon={<Icon name="refresh" size={18} color={t.text.primary} />}
        />
      }>
      <Card variant="surface" style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarCircle}>
            <Icon name="storefront-outline" size={26} color={t.text.secondary} />
          </View>
          <View style={styles.avatarInfo}>
            <Text style={styles.businessName}>{merchant.businessName}</Text>
            <View style={styles.badgeRow}>
              <Badge status="paid" label="Verified" size="sm" />
              <Badge status="fonepay" label="Fonepay active" size="sm" />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldItem}>
          <Text style={styles.fieldLabel}>PAN / VAT number</Text>
          <Text style={styles.fieldValueBold}>{formatPAN(merchant.panVatNumber)}</Text>
        </View>

        <View style={styles.fieldItem}>
          <Text style={styles.fieldLabel}>Registered address</Text>
          <Text style={styles.fieldValue}>{merchant.address}</Text>
        </View>

        <View style={styles.fieldItem}>
          <Text style={styles.fieldLabel}>Contact number</Text>
          <Text style={styles.fieldValue}>{merchant.contactNumber}</Text>
        </View>

        <View style={styles.fieldItem}>
          <Text style={styles.fieldLabel}>Registered email</Text>
          <Text style={styles.fieldValue}>{merchant.email}</Text>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Merchant code</Text>
            <Text style={styles.fieldValueMono}>{merchant.merchantCode}</Text>
          </View>
          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Terminal ID</Text>
            <Text style={styles.fieldValueMono}>{merchant.terminalId}</Text>
          </View>
        </View>
      </Card>

      <Card variant="surface" style={styles.profileCard}>
        <Text style={styles.appearanceTitle}>Appearance</Text>
        <View style={styles.appearanceRow}>
          {APPEARANCE_OPTIONS.map((opt) => (
            <Chip
              key={opt.key}
              label={opt.label}
              size="sm"
              selected={mode === opt.key}
              onPress={() => setMode(opt.key)}
            />
          ))}
        </View>
      </Card>

      <View style={styles.infoBanner}>
        <Icon name="information-circle-outline" size={18} color={t.text.secondary} />
        <Text style={styles.infoBannerText}>
          Merchant records are linked to your Fonepay account. Changes to business name
          or PAN must be updated through Fonepay merchant support.
        </Text>
      </View>
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  profileCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: t.background.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInfo: {
    flex: 1,
  },
  businessName: {
    ...typography.cardTitle,
    fontSize: 16,
    color: t.text.primary,
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  divider: {
    height: 1,
    backgroundColor: t.border.subtle,
    marginVertical: Spacing.md,
  },
  fieldItem: {
    paddingVertical: 6,
  },
  fieldLabel: {
    ...typography.caption,
    color: t.text.muted,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: Typography.size.sm,
    color: t.text.primary,
  },
  fieldValueBold: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: t.text.primary,
  },
  fieldValueMono: {
    fontSize: Typography.size.xs,
    fontFamily: 'monospace',
    color: t.text.secondary,
  },
  twoCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appearanceTitle: {
    ...typography.label,
    color: t.text.secondary,
    marginBottom: Spacing.md,
  },
  appearanceRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: t.background.subtle,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  infoBannerText: {
    flex: 1,
    ...typography.caption,
    color: t.text.secondary,
    lineHeight: 18,
  },
}));
