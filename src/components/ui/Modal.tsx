import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { shadows } from '@/constants/shadows';
import { typography } from '@/constants/typography';
import { makeStyles, useTheme } from '@/theme';
import { Icon } from './Icon';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
  const styles = useStyles();
  const t = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.keyboardAvoid}>
              <View style={styles.content}>
                {title && (
                  <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity
                      onPress={onClose}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Icon name="close" size={22} color={t.text.secondary} />
                    </TouchableOpacity>
                  </View>
                )}
                {children}
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const useStyles = makeStyles((t) => ({
  overlay: {
    flex: 1,
    backgroundColor: t.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  keyboardAvoid: {
    width: '100%',
    maxWidth: 440,
  },
  content: {
    backgroundColor: t.background.elevated,
    borderRadius: radius.card,
    padding: Spacing.xl,
    width: '100%',
    ...shadows.elevated,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...typography.sectionTitle,
    color: t.text.primary,
  },
}));
