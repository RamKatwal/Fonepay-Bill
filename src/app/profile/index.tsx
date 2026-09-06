import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { SettingsSheet } from '@/components/settings/SettingsSheet';

/**
 * Legacy /profile route — opens Settings as a bottom sheet, then pops back.
 */
export default function SettingsScreen() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/dashboard' as any);
    }
  };

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <Screen headerProps={{ title: 'Settings', showBack: true, onBack: handleClose }}>
      <SettingsSheet visible={visible} onClose={handleClose} />
    </Screen>
  );
}
