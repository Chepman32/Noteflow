/**
 * Editor Toolbar Component
 * Top toolbar for editor (section 4.6.3)
 */

import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useEffect as useReanimatedEffect,
} from 'react-native-reanimated';
import {useTheme} from '@hooks/useTheme';
import {IconButton} from '@components/common/IconButton';
import {Typography, Spacing} from '@theme';
import {SpringConfigs} from '@constants/animations';
import {BlurView} from '@react-native-community/blur';

interface EditorToolbarProps {
  title: string;
  onBack: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onShare: () => void;
  visible: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  title,
  onBack,
  onUndo,
  onRedo,
  onShare,
  visible,
}) => {
  const {theme, isDark} = useTheme();
  const translateY = useSharedValue(0);

  // Auto-hide animation
  React.useEffect(() => {
    translateY.value = withSpring(visible ? 0 : -100, SpringConfigs.smooth);
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType={isDark ? 'dark' : 'light'}
        blurAmount={10}
      />
      <View style={[styles.content, {backgroundColor: 'transparent'}]}>
        <IconButton name="chevron-back" onPress={onBack} />

        <Text
          style={[Typography.body, {color: theme.colors.textPrimary, flex: 1}]}
          numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.actions}>
          <IconButton name="arrow-undo" onPress={onUndo} />
          <IconButton name="arrow-redo" onPress={onRedo} />
          <IconButton name="share-outline" onPress={onShare} />
          <IconButton name="ellipsis-horizontal" onPress={() => {}} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    height: 56,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
});

export default EditorToolbar;
