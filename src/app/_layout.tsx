import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AppContextProvider } from '@/store/AppContext';
import { SaleContextProvider } from '@/store/SaleContext';

// Prevent splash screen auto hide until ready
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <AppContextProvider>
      <SaleContextProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#F8FAFC' },
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding/consent" />
          <Stack.Screen name="onboarding/authenticated" />
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
      </SaleContextProvider>
    </AppContextProvider>
  );
}
