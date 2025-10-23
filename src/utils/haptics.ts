/**
 * Haptic Feedback Utility
 * Wrapper around react-native-haptic-feedback
 */

import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {HapticType, HapticTypes} from '@constants/animations';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const triggerHaptic = (type: HapticType) => {
  ReactNativeHapticFeedback.trigger(type, hapticOptions);
};

export const haptics = {
  light: () => triggerHaptic(HapticTypes.light),
  medium: () => triggerHaptic(HapticTypes.medium),
  heavy: () => triggerHaptic(HapticTypes.heavy),
  success: () => triggerHaptic(HapticTypes.success),
  warning: () => triggerHaptic(HapticTypes.warning),
  error: () => triggerHaptic(HapticTypes.error),
  selection: () => triggerHaptic(HapticTypes.selection),
};
