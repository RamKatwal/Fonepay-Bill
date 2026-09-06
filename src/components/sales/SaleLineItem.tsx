import React, { useRef } from 'react';
import {
  Animated,
  LayoutAnimation,
  PanResponder,
  Platform,
  Pressable,
  Text,
  UIManager,
  View,
} from 'react-native';
import { spacing } from '@/constants/spacing';
import { makeStyles, useTheme } from '@/theme';
import { Icon } from '@/components/ui/Icon';
import { formatNPR } from '@/utils/currency';
import { lightTick } from '@/utils/haptics';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SWIPE_THRESHOLD = 96;

interface SaleLineItemProps {
  name: string;
  quantity: number;
  rate: number;
  amount: number;
  /** Tap the row to edit the line in the bottom sheet. */
  onPress: () => void;
  onRemove: () => void;
}

/**
 * Compact sale line: name + `qty × rate` + amount on a single hairline-divided
 * row. Tap opens the edit sheet; the trash icon or a left-swipe removes it.
 */
export function SaleLineItem({
  name,
  quantity,
  rate,
  amount,
  onPress,
  onRemove,
}: SaleLineItemProps) {
  const styles = useStyles();
  const t = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  // Guards a tap from firing right after a swipe (the drag ends in a click).
  const swipeEndedAt = useRef(0);
  const didMove = useRef(false);

  const springBack = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };

  const commitRemove = () => {
    lightTick();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onRemove();
  };

  const handleRowPress = () => {
    if (didMove.current || Date.now() - swipeEndedAt.current < 250) return;
    onPress();
  };

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        didMove.current = false;
      },
      onPanResponderMove: (_, g) => {
        if (Math.abs(g.dx) > 6) didMove.current = true;
        translateX.setValue(Math.min(0, g.dx));
      },
      onPanResponderRelease: (_, g) => {
        swipeEndedAt.current = Date.now();
        if (g.dx < -SWIPE_THRESHOLD || g.vx < -0.6) {
          Animated.timing(translateX, {
            toValue: -600,
            duration: 180,
            useNativeDriver: true,
          }).start(commitRemove);
        } else {
          springBack();
        }
        // Let a genuine later tap through once the click-after-drag has passed.
        setTimeout(() => {
          didMove.current = false;
        }, 300);
      },
      onPanResponderTerminate: () => {
        swipeEndedAt.current = Date.now();
        springBack();
        setTimeout(() => {
          didMove.current = false;
        }, 300);
      },
    })
  ).current;

  return (
    <View style={styles.wrap}>
      <View style={styles.removeLayer}>
        <Icon name="trash" size={18} color={t.text.inverse} />
      </View>

      <Animated.View
        style={[styles.rowAnim, { transform: [{ translateX }] }]}
        {...pan.panHandlers}>
        <Pressable style={styles.row} onPress={handleRowPress}>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.meta}>
              {quantity} × {formatNPR(rate)}
            </Text>
          </View>
          <Text style={styles.amount}>{formatNPR(amount)}</Text>
          <Pressable
            onPress={commitRemove}
            hitSlop={10}
            style={styles.trashBtn}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${name}`}>
            <Icon name="trash-outline" size={17} color={t.text.muted} />
          </Pressable>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const useStyles = makeStyles((t, type) => ({
  wrap: {
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: t.border.subtle,
  },
  removeLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: t.status.error,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: spacing.lg,
  },
  rowAnim: {
    backgroundColor: t.background.canvas,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 10,
  },
  info: {
    flex: 1,
    gap: 1,
  },
  name: {
    ...type.bodyMedium,
    fontWeight: '600',
    color: t.text.primary,
  },
  meta: {
    ...type.caption,
    color: t.text.muted,
    fontVariant: ['tabular-nums'],
  },
  amount: {
    ...type.bodyMedium,
    fontWeight: '600',
    color: t.text.primary,
    fontVariant: ['tabular-nums'],
  },
  trashBtn: {
    padding: 2,
  },
}));
