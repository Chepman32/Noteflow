/**
 * Icon Button Component
 * Based on design specification section 4.5.1
 */

import React from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@hooks/useTheme';
import {SpringConfigs, Durations} from '@constants/animations';
import {haptics} from '@utils/haptics';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface IconButtonProps {
  name: string;
  size?: number;
  color?: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  rotateOnPress?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  size = 24,
  color,
  onPress,
  disabled = false,
  style,
  rotateOnPress = false,
}) => {
  const {theme} = useTheme();
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const backgroundColor = useSharedValue(0);

  const iconColor = color || theme.colors.textPrimary;

  const handlePressIn = () => {
    haptics.light();
    scale.value = withSpring(0.9, SpringConfigs.snappy);
    backgroundColor.value = withTiming(1, {duration: Durations.fast});

    if (rotateOnPress) {
      rotation.value = withTiming(15, {duration: Durations.fast});
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SpringConfigs.snappy);
    backgroundColor.value = withTiming(0, {duration: Durations.normal});

    if (rotateOnPress) {
      rotation.value = withTiming(0, {duration: Durations.normal});
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}, {rotate: `${rotation.value}deg`}],
    backgroundColor:
      backgroundColor.value === 0 ? 'transparent' : theme.colors.surface,
  }));

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        {
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: 'center',
          justifyContent: 'center',
        },
        animatedStyle,
        style,
      ]}
      activeOpacity={1}>
      <Icon name={name} size={size} color={iconColor} />
    </AnimatedTouchable>
  );
};
