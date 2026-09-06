import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { makeStyles, useTheme } from '@/theme';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export default function NotFoundScreen() {
  const styles = useStyles();
  const t = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
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
        <Icon name="arrow-forward" size={28} color={t.text.secondary} />
      </View>
      <Text style={styles.title}>Redirecting…</Text>
      <Text style={styles.message}>Taking you to the dashboard now.</Text>
      <Button
        title="Go to dashboard"
        onPress={() => router.replace('/dashboard' as any)}
        size="md"
        variant="primary"
        fullWidth={false}
        style={styles.button}
      />
    </View>
  );
}

const useStyles = makeStyles((t, type) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: t.background.canvas,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: t.background.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...type.sectionTitle,
    color: t.text.primary,
    marginBottom: Spacing.xs,
  },
  message: {
    ...type.body,
    fontSize: 14,
    color: t.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    maxWidth: 300,
  },
  button: {
    minWidth: 200,
  },
}));
