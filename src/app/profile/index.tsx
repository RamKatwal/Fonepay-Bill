import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/store/AppContext';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';
import { formatPAN } from '@/utils/formatters';

export default function MerchantProfileScreen() {
  const router = useRouter();
  const { merchant, logout } = useAppContext();

  const handleResetPrototype = () => {
    logout();
    router.replace('/');
  };

  return (
    <Screen
      headerProps={{
        title: 'Merchant Profile',
        showBack: true,
      }}
      footer={
        <Button
          title="Reset Prototype State / Re-login"
          onPress={handleResetPrototype}
          variant="outline"
          size="md"
          leftIcon={<Icon name="refresh" size={18} color={Colors.primary} />}
        />
      }>
      {/* Merchant Identity Card */}
      <Card variant="surface" style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarCircle}>
            <Icon name="business-outline" size={32} color={Colors.primary} />
          </View>
          <View style={styles.avatarInfo}>
            <Text style={styles.businessName}>{merchant.businessName}</Text>
            <View style={styles.badgeRow}>
              <Badge status="paid" label="Verified Merchant" size="sm" />
              <Badge status="fonepay" label="Fonepay Active" size="sm" />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldItem}>
          <Text style={styles.fieldLabel}>PAN / VAT Number</Text>
          <Text style={styles.fieldValueBold}>{formatPAN(merchant.panVatNumber)}</Text>
        </View>

        <View style={styles.fieldItem}>
          <Text style={styles.fieldLabel}>Registered Address</Text>
          <Text style={styles.fieldValue}>{merchant.address}</Text>
        </View>

        <View style={styles.fieldItem}>
          <Text style={styles.fieldLabel}>Contact Number</Text>
          <Text style={styles.fieldValue}>{merchant.contactNumber}</Text>
        </View>

        <View style={styles.fieldItem}>
          <Text style={styles.fieldLabel}>Registered Email</Text>
          <Text style={styles.fieldValue}>{merchant.email}</Text>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Merchant Code</Text>
            <Text style={styles.fieldValueMono}>{merchant.merchantCode}</Text>
          </View>
          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Terminal ID</Text>
            <Text style={styles.fieldValueMono}>{merchant.terminalId}</Text>
          </View>
        </View>
      </Card>

      {/* Read-Only Notice Box */}
      <View style={styles.infoBanner}>
        <Icon name="information-circle-outline" size={20} color={Colors.textSecondary} />
        <Text style={styles.infoBannerText}>
          Merchant records are securely linked with your Fonepay merchant account. Changes to business name or PAN must be updated through Fonepay Merchant Support.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginVertical: Spacing.md,
  },
  fieldItem: {
    paddingVertical: 6,
  },
  fieldLabel: {
    fontSize: Typography.size.xxs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: Typography.size.sm,
    color: Colors.text,
  },
  fieldValueBold: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  fieldValueMono: {
    fontSize: Typography.size.xs,
    fontFamily: 'monospace',
    color: Colors.textSecondary,
  },
  twoCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceSubtle,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  infoBannerText: {
    flex: 1,
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
