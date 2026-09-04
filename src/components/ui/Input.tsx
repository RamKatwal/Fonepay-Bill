import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { typography } from '@/constants/typography';
import { makeStyles, useTheme } from '@/theme';
import { Icon } from './Icon';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  prefix?: string;
  suffix?: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  onClear?: () => void;
  required?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  prefix,
  suffix,
  containerStyle,
  inputStyle,
  value,
  onClear,
  required = false,
  editable = true,
  ...rest
}: InputProps) {
  const styles = useStyles();
  const t = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;
  const isFilled = !!value && value.length > 0;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.requiredAsterisk}> *</Text>}
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          isFilled && styles.filledContainer,
          isFocused && styles.focused,
          hasError && styles.errorBorder,
          !editable && styles.disabledContainer,
          inputStyle,
        ]}>
        {prefix && <Text style={styles.prefixText}>{prefix}</Text>}

        <TextInput
          value={value}
          editable={editable}
          placeholderTextColor={t.text.muted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, !editable && styles.disabledText]}
          {...rest}
        />

        {value && onClear && editable ? (
          <TouchableOpacity
            onPress={onClear}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Clear text">
            <Icon name="close-circle" size={18} color={t.text.muted} />
          </TouchableOpacity>
        ) : null}

        {suffix && <Text style={styles.suffixText}>{suffix}</Text>}
      </View>

      {hasError ? (
        <View style={styles.errorRow}>
          <Icon name="alert-circle" size={14} color={t.status.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.label,
    color: t.text.secondary,
  },
  requiredAsterisk: {
    color: t.text.secondary,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: t.background.surface,
    borderWidth: 1,
    borderColor: t.border.default,
    borderRadius: radius.medium,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  filledContainer: {
    borderColor: t.border.default,
  },
  focused: {
    borderColor: t.border.strong,
    backgroundColor: t.background.surface,
  },
  errorBorder: {
    borderColor: t.status.error,
  },
  disabledContainer: {
    backgroundColor: t.background.subtle,
    borderColor: t.border.subtle,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: t.text.primary,
    paddingVertical: spacing.sm,
  },
  disabledText: {
    color: t.text.muted,
  },
  prefixText: {
    ...typography.bodyMedium,
    color: t.text.secondary,
    marginRight: spacing.xs,
  },
  suffixText: {
    ...typography.caption,
    color: t.text.muted,
    marginLeft: spacing.xs,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: t.status.error,
  },
  helperText: {
    ...typography.caption,
    color: t.text.muted,
    marginTop: spacing.xs,
  },
}));
