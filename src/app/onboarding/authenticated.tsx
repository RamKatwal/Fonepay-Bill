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

export default function AuthenticatedScreen() {
  const router = useRouter();
  const { merchant } = useAppContext();

  const handleContinue = () => {
    router.replace('/dashboard' as any);
  };

  return (
    <Screen
      headerProps={{
        title: 'Merchant Profile',
        showBack: false,
      }}
      footer={
        <Button
          title="Continue to Dashboard"
          onPress={handleContinue}
          size="lg"
          rightIcon={<Icon name="arrow-forward" size={20} color={Colors.textInverse} />}
        />
      }>
      <View style={styles.container}>
        <View style={styles.statusRow}>
          <View style={styles.checkCircle}>
            <Icon name="checkmark" size={24} color={Colors.success} />
          </View>
          <View>
            <Text style={styles.verifiedTitle}>Merchant Verified</Text>
            <Text style={styles.verifiedSub}>Authenticated with Fonepay</Text>
          </View>
        </View>

        <Card variant="surface" style={styles.profileCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>Merchant Information</Text>
            <Badge status="paid" label="Read-Only" size="sm" showIcon={false} />
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Business Name</Text>
            <Text style={styles.fieldValue}>{merchant.businessName}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>PAN / VAT Number</Text>
            <Text style={styles.fieldValueBold}>{formatPAN(merchant.panVatNumber)}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Address</Text>
            <Text style={styles.fieldValue}>{merchant.address}</Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Contact Number</Text>
            <Text style={styles.fieldValue}>{merchant.contactNumber}</Text>
          </View>

          <View style={styles.fieldRowLast}>
            <Text style={styles.fieldLabel}>Merchant Code</Text>
            <Text style={styles.fieldValueMono}>{merchant.merchantCode}</Text>
          </View>
        </Card>

        <View style={styles.noteCard}>
          <Icon name="information-circle-outline" size={20} color={Colors.primary} />
          <Text style={styles.noteText}>
            These verified business credentials will automatically appear on all bills you generate for your customers.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  checkCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.successSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  verifiedSub: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
  },
  profileCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  sectionTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
  },
  fieldRow: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  fieldRowLast: {
    paddingVertical: Spacing.sm,
  },
  fieldLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: Typography.size.sm,
    color: Colors.text,
    fontWeight: Typography.weight.medium,
  },
  fieldValueBold: {
    fontSize: Typography.size.sm,
    color: Colors.text,
    fontWeight: Typography.weight.bold,
  },
  fieldValueMono: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMuted,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  noteText: {
    flex: 1,
    fontSize: Typography.size.xs,
    color: Colors.primaryDark,
    lineHeight: 16,
  },
});
