import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AppContextProvider } from '@/store/AppContext';
import { SaleContextProvider } from '@/store/SaleContext';
import { ThemeProvider, useTheme, useThemeMode } from '@/theme';
import { fontAssets } from '@/theme/fonts';

// Prevent splash screen auto hide until ready
SplashScreen.preventAutoHideAsync().catch(() => {});

function ThemedStack() {
  const t = useTheme();
  const { scheme } = useThemeMode();

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: t.background.canvas },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard/index" />
        <Stack.Screen name="sales/index" />
        <Stack.Screen name="sales/preview" />
        <Stack.Screen name="sales/payment" />
        <Stack.Screen name="sales/payment-status" />
        <Stack.Screen name="sales/success" />
        <Stack.Screen name="sales/bill" />
        <Stack.Screen name="history/index" />
        <Stack.Screen name="history/[id]" />
        <Stack.Screen name="profile/index" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <AppContextProvider>
        <SaleContextProvider>
          <ThemedStack />
        </SaleContextProvider>
      </AppContextProvider>
    </ThemeProvider>
  );
}
