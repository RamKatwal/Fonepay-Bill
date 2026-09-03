import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { Header, HeaderProps } from './Header';
import { BottomActionBar } from './BottomActionBar';

export interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  headerProps?: HeaderProps;
  footer?: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  edges?: Edge[];
  backgroundColor?: string;
  testID?: string;
}

export function Screen({
  children,
  scrollable = true,
  headerProps,
  footer,
  style,
  contentContainerStyle,
  edges = ['top', 'left', 'right'],
  backgroundColor = colors.background.canvas,
  testID,
}: ScreenProps) {
  return (
    <SafeAreaView
      testID={testID}
      edges={edges}
      style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}>
        {headerProps && <Header {...headerProps} />}

        {scrollable ? (
          <ScrollView
            style={[styles.container, style]}
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.centerConstrain}>{children}</View>
          </ScrollView>
        ) : (
          <View style={[styles.container, styles.fixedContainer, style]}>
            <View style={styles.centerConstrain}>{children}</View>
          </View>
        )}

        {footer && <BottomActionBar>{footer}</BottomActionBar>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  centerConstrain: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  fixedContainer: {
    padding: spacing.lg,
  },
});
