import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { shadows } from '@/constants/shadows';
import { makeStyles, useTheme } from '@/theme';
import { Icon, IconName } from './Icon';

/** Screen-space rectangle of the trigger, from `measureInWindow`. */
export interface AnchorRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DropdownMenuItem {
  key: string;
  label: string;
  icon?: IconName;
  selected?: boolean;
  /** Draw a hairline separator above this item (e.g. before "Custom range…"). */
  divided?: boolean;
}

interface DropdownMenuProps {
  visible: boolean;
  onClose: () => void;
  /** Where to anchor the menu — measure the trigger on open and pass it here. */
  anchor: AnchorRect | null;
  items: DropdownMenuItem[];
  onSelect: (key: string) => void;
  minWidth?: number;
}

const GAP = 6;
const EDGE = spacing.lg;

/**
 * A lightweight anchored dropdown. Rendered in a transparent modal (so it
 * escapes card `overflow: hidden`), positioned just below the trigger, and
 * dismissed by tapping anywhere outside it.
 */
export function DropdownMenu({
  visible,
  onClose,
  anchor,
  items,
  onSelect,
  minWidth = 200,
}: DropdownMenuProps) {
  const styles = useStyles();
  const t = useTheme();
  const { width: screenW, height: screenH } = useWindowDimensions();

  if (!visible || !anchor) return null;

  const menuW = Math.max(minWidth, anchor.width);
  let left = anchor.x;
  if (left + menuW > screenW - EDGE) left = screenW - EDGE - menuW;
  if (left < EDGE) left = EDGE;
  const top = anchor.y + anchor.height + GAP;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.fill}>
        <Pressable style={styles.fill} onPress={onClose} accessibilityLabel="Dismiss menu" />

        <View
          style={[
            styles.menu,
            { top, left, minWidth: menuW, maxHeight: screenH * 0.6 },
          ]}>
          <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
            {items.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => onSelect(item.key)}
                accessibilityRole="menuitem"
                style={({ pressed }) => [
                  styles.row,
                  item.divided && styles.rowDivided,
                  pressed && styles.rowPressed,
                ]}>
                {item.icon && (
                  <Icon
                    name={item.icon}
                    size={16}
                    color={item.selected ? t.text.primary : t.text.secondary}
                  />
                )}
                <Text
                  style={[styles.rowLabel, item.selected && styles.rowLabelSelected]}
                  numberOfLines={1}>
                  {item.label}
                </Text>
                {item.selected && (
                  <Icon name="checkmark" size={16} color={t.text.primary} />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const useStyles = makeStyles((t, type) => ({
  fill: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    backgroundColor: t.background.elevated,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: t.border.default,
    paddingVertical: spacing.xs,
    overflow: 'hidden',
    ...shadows.elevated,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  rowDivided: {
    borderTopWidth: 1,
    borderTopColor: t.border.subtle,
    marginTop: spacing.xs,
    paddingTop: spacing.md,
  },
  rowPressed: {
    backgroundColor: t.background.subtle,
  },
  rowLabel: {
    ...type.bodyMedium,
    flex: 1,
    color: t.text.secondary,
  },
  rowLabelSelected: {
    color: t.text.primary,
    fontWeight: '700',
  },
}));
