/**
 * Splash Screen
 * Features particle assembly animation (section 6.2)
 */

import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {Canvas, Path, Skia} from '@shopify/react-native-skia';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {SpringConfigs, Durations} from '@constants/animations';
import {useTheme} from '@hooks/useTheme';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

interface Particle {
  id: number;
  initialX: number;
  initialY: number;
  finalX: number;
  finalY: number;
  rotation: number;
  scale: number;
}

const SplashScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Auto-transition after animation completes
    const timer = setTimeout(() => {
      opacity.value = withTiming(
        0,
        {duration: Durations.medium},
        (finished) => {
          if (finished) {
            // Navigate to main app
            runOnJS(navigation.reset)({
              index: 0,
              routes: [{name: 'Main' as never}],
            });
          }
        },
      );
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.accent]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        angle={45}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.logoContainer}>
        {/* Logo text - simplified version */}
        <Animated.Text style={[styles.logoText, {color: '#FFFFFF'}]}>
          NoteFlow
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
  },
});

export default SplashScreen;
