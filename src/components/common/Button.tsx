/**
 * Button Component
 * Based on design specification section 4.5.1
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useTheme} from '@hooks/useTheme';
import {Typography, Spacing} from '@theme';
import {SpringConfigs} from '@constants/animations';
import {haptics} from '@utils/haptics';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export type ButtonVariant = 'primary' | 'secondary' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const {theme} = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    haptics.light();
    scale.value = withSpring(0.95, SpringConfigs.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SpringConfigs.snappy);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const sizeStyles = {
    small: {
      height: 40,
      paddingHorizontal: Spacing.md,
    },
    medium: {
      height: 48,
      paddingHorizontal: Spacing.lg,
    },
    large: {
      height: 56,
      paddingHorizontal: Spacing.xl,
    },
  };

  const buttonStyle: ViewStyle = {
    height: sizeStyles[size].height,
    paddingHorizontal: sizeStyles[size].paddingHorizontal,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...(fullWidth && {width: '100%'}),
  };

  const variantStyles: Record<ButtonVariant, {button: ViewStyle; text: TextStyle}> = {
    primary: {
      button: {
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 4,
      },
      text: {
        color: '#FFFFFF',
      },
    },
    secondary: {
      button: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1.5,
        borderColor: theme.colors.primary,
      },
      text: {
        color: theme.colors.primary,
      },
    },
    text: {
      button: {
        backgroundColor: 'transparent',
      },
      text: {
        color: theme.colors.primary,
      },
    },
  };

  const disabledStyle: ViewStyle = {
    opacity: 0.5,
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        buttonStyle,
        variantStyles[variant].button,
        animatedStyle,
        disabled && disabledStyle,
        style,
      ]}
      activeOpacity={0.9}>
      {loading ? (
        <ActivityIndicator color={variantStyles[variant].text.color} />
      ) : (
        <Text
          style={[
            Typography.bodyLarge,
            {fontWeight: '600'},
            variantStyles[variant].text,
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </AnimatedTouchable>
  );
};
