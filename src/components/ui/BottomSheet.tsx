import React, { useEffect, useRef, useState } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  Animated,
  Keyboard,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { shadows } from '@/constants/shadows';
import { motion } from '@/constants/motion';
import { makeStyles } from '@/theme';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  /** Right-aligned dismiss affordance text (default "Cancel"). Pass empty/null to hide. */
  cancelLabel?: string | null;
  children: React.ReactNode;
}

/**
 * Slide-up bottom sheet — backdrop tap to dismiss, grab handle, safe-area
 * bottom padding. When the keyboard opens the sheet is lifted above it so
 * type-ahead dropdowns (e.g. item name) stay reachable on mobile.
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
  const { height: screenHeight } = useWindowDimensions();
  const [rendered, setRendered] = useState(visible);
  // Always start closed so opening (including mount-with-visible) slides up.
  const anim = useRef(new Animated.Value(0)).current;
  const visibleRef = useRef(visible);
  const scrollRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  visibleRef.current = visible;

  useEffect(() => {
    if (visible) {
      setRendered(true);
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: motion.duration.normal,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(anim, {
      toValue: 0,
      duration: motion.duration.fast,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visibleRef.current) {
        setRendered(false);
      }
    });
  }, [visible, anim]);

  useEffect(() => {
    if (!visible) {
      setKeyboardHeight(0);
      return;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: { endCoordinates?: { height?: number } }) => {
      const height = e.endCoordinates?.height ?? 0;
      setKeyboardHeight(height);
      // Keep the focused field / dropdown in view after the sheet lifts.
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      });
    };
    const onHide = () => setKeyboardHeight(0);

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [visible]);

  if (!rendered) return null;

  const slideY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [480, 0],
  });

  const restingPadding = Math.max(insets.bottom, Spacing.xl);
  // Lift the whole sheet above the keyboard (padding alone leaves content covered).
  const sheetBottom = keyboardHeight;
  const maxHeight = Math.max(
    240,
    screenHeight - keyboardHeight - insets.top - Spacing.md
  );

  return (
    <RNModal
      visible={rendered}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.fill}>
        <Animated.View style={[styles.backdrop, { opacity: anim }]}>
          <Pressable
            style={styles.fill}
            onPress={() => {
              Keyboard.dismiss();
              onClose();
            }}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              bottom: sheetBottom,
              paddingBottom: restingPadding,
              maxHeight,
              transform: [{ translateY: slideY }],
            },
          ]}>
          <View style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>

          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              {!!cancelLabel && (
                <Pressable onPress={onClose} hitSlop={8}>
                  <Text style={styles.cancel}>{cancelLabel}</Text>
                </Pressable>
              )}
            </View>
          )}

          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            nestedScrollEnabled
            automaticallyAdjustKeyboardInsets={false}
            showsVerticalScrollIndicator={false}
            style={styles.body}
            contentContainerStyle={styles.bodyContent}>
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </RNModal>
  );
}

const useStyles = makeStyles((t, type) => ({
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
    backgroundColor: t.background.elevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
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
    ...type.screenTitle,
    fontSize: 18,
    color: t.text.primary,
  },
  cancel: {
    ...type.bodyMedium,
    color: t.text.secondary,
    padding: 4,
  },
  body: {
    flexGrow: 0,
    flexShrink: 1,
  },
  bodyContent: {
    gap: Spacing.md,
    paddingBottom: Spacing.xs,
    flexGrow: 1,
  },
}));
