import React, { useEffect, useRef } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { shadows } from '@/constants/shadows';
import { typography } from '@/constants/typography';
import { motion } from '@/constants/motion';
import { makeStyles } from '@/theme';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  /** Right-aligned dismiss affordance text (default "Cancel"). */
  cancelLabel?: string;
  children: React.ReactNode;
}

/**
 * Slide-up bottom sheet — backdrop tap to dismiss, grab handle, safe-area
 * bottom padding, keyboard-aware. Matches the Fonepay "Add item" pattern.
 */
export function BottomSheet({
  visible,
  onClose,
  title,
  cancelLabel = 'Cancel',
  children,
}: BottomSheetProps) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = React.useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: motion.duration.normal,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: motion.duration.fast,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, anim]);

  if (!mounted) return null;

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [480, 0],
  });

  return (
    <RNModal visible transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View style={[styles.backdrop, { opacity: anim }]}>
          <Pressable style={styles.fill} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, Spacing.xl), transform: [{ translateY }] },
          ]}>
          <View style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>

          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Text style={styles.cancel}>{cancelLabel}</Text>
              </Pressable>
            </View>
          )}

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.body}
            contentContainerStyle={styles.bodyContent}>
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

const useStyles = makeStyles((t) => ({
  fill: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: t.overlay,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: t.background.elevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    maxHeight: '88%',
    ...shadows.elevated,
  },
  handleWrap: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: t.border.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: Spacing.md,
  },
  title: {
    ...typography.screenTitle,
    fontSize: 18,
    color: t.text.primary,
  },
  cancel: {
    ...typography.bodyMedium,
    color: t.text.secondary,
    padding: 4,
  },
  body: {
    flexGrow: 0,
  },
  bodyContent: {
    gap: Spacing.md,
    paddingBottom: Spacing.xs,
  },
}));
