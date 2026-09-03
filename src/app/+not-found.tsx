import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export default function NotFoundScreen() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // If URL contains /index suffix, automatically redirect to canonical route
    if (pathname === '/dashboard/index' || pathname.startsWith('/dashboard/index')) {
      router.replace('/dashboard' as any);
    } else if (pathname === '/sales/index') {
      router.replace('/sales' as any);
    } else if (pathname === '/history/index') {
      router.replace('/history' as any);
    } else if (pathname === '/profile/index') {
      router.replace('/profile' as any);
    }
  }, [pathname, router]);

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name="alert-circle" size={48} color={Colors.primary} />
      </View>
      <Text style={styles.title}>Redirecting to Dashboard...</Text>
      <Text style={styles.message}>
        The canonical URL is /dashboard. Taking you there now.
      </Text>
      <Button
        title="Go to Dashboard"
        onPress={() => router.replace('/dashboard' as any)}
        size="md"
        variant="primary"
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  message: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    maxWidth: 300,
  },
  button: {
    minWidth: 200,
  },
});
