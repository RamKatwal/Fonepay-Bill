import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/store/AppContext';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';

export default function EntryScreen() {
  const router = useRouter();
  const { isAuthenticated, isConsented } = useAppContext();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.replace('/dashboard' as any);
    } else if (isConsented) {
      router.replace('/onboarding/authenticated');
    } else {
      router.push('/onboarding/consent');
    }
  };

  return (
    <Screen
      scrollable={false}
      style={styles.container}
      footer={
        <Button
          title={isAuthenticated ? 'Go to Dashboard' : 'Get Started with Fonepay'}
          onPress={handleGetStarted}
          size="lg"
          rightIcon={<Icon name="arrow-forward" size={20} color={Colors.textInverse} />}
        />
      }>
      <View style={styles.centerContent}>
        {/* Fonepay Badge / Brand Mark */}
        <View style={styles.brandIconContainer}>
          <Icon name="receipt" size={48} color={Colors.primary} />
        </View>

        <Text style={styles.appName}>Fonepay</Text>
        <Text style={styles.productTitle}>Digital Bill Generator</Text>
        <Text style={styles.tagline}>Create Bill • Get Paid • Share</Text>

        <View style={styles.featurePills}>
          <View style={styles.pill}>
            <Icon name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={styles.pillText}>Instant Sales Bills</Text>
          </View>
          <View style={styles.pill}>
            <Icon name="qr-code-outline" size={16} color={Colors.primary} />
            <Text style={styles.pillText}>Fonepay QR & Cash</Text>
          </View>
          <View style={styles.pill}>
            <Icon name="share-social-outline" size={16} color={Colors.cash} />
            <Text style={styles.pillText}>Fast Digital Sharing</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 360,
  },
  brandIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primaryMuted,
    borderWidth: 2,
    borderColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  appName: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  productTitle: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.heavy,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
  },
  featurePills: {
    gap: Spacing.sm,
    width: '100%',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  pillText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.text,
  },
});
