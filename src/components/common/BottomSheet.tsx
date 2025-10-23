/**
 * Bottom Sheet Component
 * Based on design specification section 4.5.4
 */

import React, {useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useAnimatedGestureHandler,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {PanGestureHandler, PanGestureHandlerGestureEvent} from 'react-native-gesture-handler';
import {BlurView} from '@react-native-community/blur';
import {useTheme} from '@hooks/useTheme';
import {Spacing} from '@theme';
import {SpringConfigs} from '@constants/animations';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  snapPoints?: number[]; // Percentages: e.g., [0.25, 0.5, 0.9]
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  snapPoints = [0.5, 0.9],
  children,
}) => {
  const {theme, isDark} = useTheme();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const context = useSharedValue({y: 0});

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(
        SCREEN_HEIGHT * (1 - snapPoints[0]),
        SpringConfigs.gentle,
      );
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, SpringConfigs.gentle);
    }
  }, [visible, snapPoints]);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {y: number}
  >({
    onStart: (_, ctx) => {
      ctx.y = translateY.value;
    },
    onActive: (event, ctx) => {
      translateY.value = Math.max(ctx.y + event.translationY, 0);
    },
    onEnd: (event) => {
      const velocity = event.velocityY;
      const currentPosition = translateY.value;

      // Determine which snap point to animate to
      let targetSnapPoint = snapPoints[0];

      if (velocity > 800) {
        // Fast downward swipe - dismiss
        translateY.value = withSpring(SCREEN_HEIGHT, SpringConfigs.fluid);
        runOnJS(onClose)();
        return;
      } else if (velocity < -800) {
        // Fast upward swipe - go to highest snap point
        targetSnapPoint = snapPoints[snapPoints.length - 1];
      } else {
        // Find nearest snap point
        const currentPercentage = 1 - currentPosition / SCREEN_HEIGHT;
        let minDiff = Math.abs(currentPercentage - snapPoints[0]);
        targetSnapPoint = snapPoints[0];

        for (const snapPoint of snapPoints) {
          const diff = Math.abs(currentPercentage - snapPoint);
          if (diff < minDiff) {
            minDiff = diff;
            targetSnapPoint = snapPoint;
          }
        }
      }

      // Check if should dismiss
      if (currentPosition > SCREEN_HEIGHT * 0.7) {
        translateY.value = withSpring(SCREEN_HEIGHT, SpringConfigs.fluid);
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(
          SCREEN_HEIGHT * (1 - targetSnapPoint),
          SpringConfigs.fluid,
        );
      }
    },
  });

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, SCREEN_HEIGHT],
      [0.4, 0],
      Extrapolate.CLAMP,
    );
    return {opacity};
  });

  if (!visible) {
    return null;
  }

  return (
    <Modal transparent visible={visible} statusBarTranslucent animationType="none">
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, backdropStyle]}>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType={isDark ? 'dark' : 'light'}
              blurAmount={10}
            />
          </Animated.View>
        </TouchableWithoutFeedback>

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              styles.sheet,
              {backgroundColor: theme.colors.surface},
              animatedSheetStyle,
            ]}>
            <View style={[styles.handle, {backgroundColor: theme.colors.textSecondary}]} />
            <View style={styles.content}>{children}</View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 5,
    minHeight: SCREEN_HEIGHT * 0.25,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  content: {
    flex: 1,
  },
});
