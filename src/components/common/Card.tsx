/**
 * Card Component
 * Based on design specification section 4.5.3
 */

import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useTheme} from '@hooks/useTheme';
import {Spacing} from '@theme';
import {SpringConfigs} from '@constants/animations';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  liftOnPress?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  liftOnPress = false,
}) => {
  const {theme} = useTheme();
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (liftOnPress) {
      translateY.value = withSpring(-8, SpringConfigs.smooth);
      scale.value = withSpring(1.02, SpringConfigs.smooth);
    }
  };

  const handlePressOut = () => {
    if (liftOnPress) {
      translateY.value = withSpring(0, SpringConfigs.smooth);
      scale.value = withSpring(1, SpringConfigs.smooth);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}, {scale: scale.value}],
  }));

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  };

  if (onPress) {
    return (
      <Animated.View
        style={[cardStyle, animatedStyle, style]}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}>
        {children}
      </Animated.View>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};
