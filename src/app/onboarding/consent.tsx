import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/store/AppContext';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';

export default function ConsentScreen() {
  const router = useRouter();
  const { loginWithFonepay, isLoadingAuth } = useAppContext();

  const handleConsent = async () => {
    await loginWithFonepay();
    router.replace('/onboarding/authenticated');
  };

  return (
    <Screen
      headerProps={{
        title: 'Fonepay Consent',
        showBack: true,
      }}
      footer={
        <Button
          title="Grant Consent & Continue"
          onPress={handleConsent}
          loading={isLoadingAuth}
          size="lg"
          rightIcon={<Icon name="arrow-forward" size={20} color={Colors.textInverse} />}
        />
      }>
      <View style={styles.container}>
        <View style={styles.badgeContainer}>
          <Icon name="shield-checkmark-outline" size={32} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Merchant Consent Required</Text>
        <Text style={styles.subtitle}>
          To create digital bills and receive payments, allow Fonepay to access your registered merchant information.
        </Text>

        <Card variant="surface" style={styles.consentCard}>
          <Text style={styles.cardHeader}>Fonepay will provide read-only access to:</Text>

          <View style={styles.permissionItem}>
            <Icon name="business-outline" size={20} color={Colors.primary} />
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>Business Name & Address</Text>
              <Text style={styles.itemDesc}>Printed on your customer invoices</Text>
            </View>
          </View>

          <View style={styles.permissionItem}>
            <Icon name="document-text-outline" size={20} color={Colors.primary} />
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>PAN / VAT Number</Text>
              <Text style={styles.itemDesc}>Required for official tax compliance</Text>
            </View>
          </View>

          <View style={styles.permissionItem}>
            <Icon name="call-outline" size={20} color={Colors.primary} />
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>Merchant Contact Number</Text>
              <Text style={styles.itemDesc}>Used for billing notifications</Text>
            </View>
          </View>
        </Card>

        <View style={styles.noticeBox}>
          <Icon name="information-circle-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.noticeText}>
            Merchant information is fetched directly from Fonepay and cannot be modified within the bill generator.
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
  badgeContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  consentCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    gap: Spacing.md,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.text,
  },
  itemDesc: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  noticeText: {
    flex: 1,
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
