/**
 * Input Component
 * Based on design specification section 4.5.2
 */

import React, {useState} from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useTheme} from '@hooks/useTheme';
import {Typography, Spacing} from '@theme';
import {Durations} from '@constants/animations';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const {theme} = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    borderColor.value = withTiming(1, {duration: Durations.normal});
    scale.value = withTiming(1.01, {duration: Durations.normal});
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    borderColor.value = withTiming(0, {duration: Durations.normal});
    scale.value = withTiming(1, {duration: Durations.normal});
    onBlur?.(e);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const currentBorderColor =
      borderColor.value === 0 ? theme.colors.border : theme.colors.primary;

    return {
      borderColor: currentBorderColor,
      transform: [{scale: scale.value}],
      shadowColor: theme.colors.primary,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: borderColor.value * 0.1,
      shadowRadius: 4,
    };
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[Typography.captionLarge, {color: theme.colors.textSecondary}]}>
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          {
            height: 48,
            borderRadius: 10,
            borderWidth: 1,
            backgroundColor: theme.colors.surface,
            paddingHorizontal: Spacing.md,
            justifyContent: 'center',
          },
          animatedStyle,
        ]}>
        <TextInput
          {...textInputProps}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            Typography.body,
            {
              color: theme.colors.textPrimary,
              padding: 0,
              margin: 0,
            },
          ]}
          placeholderTextColor={theme.colors.textSecondary}
        />
      </Animated.View>
      {error && (
        <Text
          style={[
            Typography.caption,
            {color: theme.colors.error, marginTop: Spacing.xs},
          ]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
});
