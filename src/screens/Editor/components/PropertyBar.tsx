/**
 * Property Bar Component
 * Bottom bar for tool properties (section 4.6.3)
 */

import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Animated from 'react-native-reanimated';
import {useTheme} from '@hooks/useTheme';
import {useEditorStore} from '@store/editor';
import {PenTool} from '@constants/drawing';
import {Spacing} from '@theme';
import {BlurView} from '@react-native-community/blur';
import ColorPicker from './ColorPicker';
import Slider from './Slider';

const PropertyBar: React.FC = () => {
  const {theme, isDark} = useTheme();
  const {activeTool, penColor, penWidth, penOpacity, setPenColor, setPenWidth, setPenOpacity} =
    useEditorStore();

  // Show different properties based on active tool
  const showColorPicker = activeTool !== PenTool.Eraser;
  const showWidthSlider = true;
  const showOpacitySlider = activeTool === PenTool.Highlighter || activeTool === PenTool.Pencil;

  return (
    <View style={styles.container}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType={isDark ? 'dark' : 'light'}
        blurAmount={10}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {showColorPicker && <ColorPicker value={penColor} onChange={setPenColor} />}
        {showWidthSlider && (
          <Slider
            label="Width"
            value={penWidth}
            min={0.5}
            max={20}
            onChange={setPenWidth}
          />
        )}
        {showOpacitySlider && (
          <Slider
            label="Opacity"
            value={penOpacity}
            min={0.1}
            max={1}
            step={0.1}
            onChange={setPenOpacity}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
});

export default PropertyBar;
