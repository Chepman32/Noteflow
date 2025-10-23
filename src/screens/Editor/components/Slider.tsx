/**
 * Slider Component
 * For adjusting numeric values (width, opacity, etc.)
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {useTheme} from '@hooks/useTheme';
import {Typography, Spacing} from '@theme';
import {SpringConfigs} from '@constants/animations';
import {clamp} from '@utils/math';
import {haptics} from '@utils/haptics';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

const SLIDER_WIDTH = 150;
const THUMB_SIZE = 24;

const Slider: React.FC<SliderProps> = ({label, value, min, max, step = 0.1, onChange}) => {
  const {theme} = useTheme();
  const thumbScale = useSharedValue(1);
  const dragX = useSharedValue(0);

  // Calculate initial position
  const normalizedValue = (value - min) / (max - min);
  const initialX = normalizedValue * (SLIDER_WIDTH - THUMB_SIZE);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      thumbScale.value = withSpring(1.3, SpringConfigs.snappy);
      runOnJS(haptics.light)();
    })
    .onUpdate((event) => {
      const newX = clamp(initialX + event.translationX, 0, SLIDER_WIDTH - THUMB_SIZE);
      dragX.value = newX;

      const normalized = newX / (SLIDER_WIDTH - THUMB_SIZE);
      const newValue = min + normalized * (max - min);
      const steppedValue = Math.round(newValue / step) * step;

      runOnJS(onChange)(steppedValue);
    })
    .onEnd(() => {
      thumbScale.value = withSpring(1, SpringConfigs.snappy);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{translateX: dragX.value}, {scale: thumbScale.value}],
  }));

  const trackFillStyle = useAnimatedStyle(() => ({
    width: dragX.value + THUMB_SIZE / 2,
  }));

  return (
    <View style={styles.container}>
      <Text style={[Typography.caption, {color: theme.colors.textSecondary}]}>{label}</Text>
      <View style={styles.sliderContainer}>
        <View style={[styles.track, {backgroundColor: theme.colors.border}]}>
          <Animated.View
            style={[
              styles.trackFill,
              {backgroundColor: theme.colors.primary},
              trackFillStyle,
            ]}
          />
        </View>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.thumb,
              {backgroundColor: theme.colors.primary},
              thumbStyle,
            ]}
          />
        </GestureDetector>
      </View>
      <Text style={[Typography.caption, {color: theme.colors.textPrimary}]}>
        {value.toFixed(1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sliderContainer: {
    width: SLIDER_WIDTH,
    height: THUMB_SIZE,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  trackFill: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default Slider;
