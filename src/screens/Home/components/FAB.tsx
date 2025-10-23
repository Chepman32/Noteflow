/**
 * Floating Action Button (FAB)
 * Based on section 4.6.2
 */

import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '@hooks/useTheme';
import {Spacing} from '@theme';
import {SpringConfigs, Durations} from '@constants/animations';
import {haptics} from '@utils/haptics';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

interface FABProps {
  onPress: () => void;
}

const FAB: React.FC<FABProps> = ({onPress}) => {
  const {theme} = useTheme();
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const handlePressIn = () => {
    haptics.medium();
    scale.value = withSpring(0.9, SpringConfigs.snappy);
    rotation.value = withTiming(45, {duration: Durations.normal});
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SpringConfigs.snappy);
    rotation.value = withTiming(0, {duration: Durations.normal});
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}, {rotate: `${rotation.value}deg`}],
  }));

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.fab, animatedStyle]}>
      <AnimatedGradient
        colors={[theme.colors.primary, theme.colors.accent]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradient}>
        <Icon name="add" size={32} color="#FFFFFF" />
      </AnimatedGradient>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FAB;
