import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { makeStyles, useTheme } from '@/theme';
import { useTransactions } from '@/hooks/useTransactions';

export default function FoldersScreen() {
  const router = useRouter();
  const styles = useStyles();
  const t = useTheme();
  const { totalCount } = useTransactions();

  const handleOpenQuickbill = () => {
    router.push('/dashboard' as any);
  };

  return (
    <Screen headerProps={{ title: 'Bills' }}>
      <Text style={styles.sectionLabel}>Folders</Text>

      <Card
        variant="surface"
        padding="md"
        style={styles.folderCard}
        onPress={handleOpenQuickbill}>
        <View style={styles.folderRow}>
          <View style={styles.folderIcon}>
            <Icon name="folder-outline" size={22} color={t.text.secondary} />
          </View>
          <View style={styles.folderText}>
            <Text style={styles.folderName} numberOfLines={1}>
              Quickbill
            </Text>
            <Text style={styles.folderMeta} numberOfLines={1}>
              {totalCount} {totalCount === 1 ? 'bill' : 'bills'}
            </Text>
          </View>
          <Icon name="chevron-forward" size={18} color={t.text.muted} />
        </View>
      </Card>
    </Screen>
  );
}

const useStyles = makeStyles((t, type) => ({
  sectionLabel: {
    ...type.label,
    color: t.text.secondary,
    marginBottom: spacing.md,
  },
  folderCard: {
    marginBottom: spacing.md,
  },
  folderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  folderIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.medium,
    backgroundColor: t.background.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderText: {
    flex: 1,
  },
  folderName: {
    ...type.cardTitle,
    fontSize: 16,
    color: t.text.primary,
    marginBottom: 2,
  },
  folderMeta: {
    ...type.caption,
    color: t.text.muted,
  },
}));
