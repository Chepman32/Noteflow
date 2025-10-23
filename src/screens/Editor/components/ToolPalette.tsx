/**
 * Tool Palette Component
 * Vertical tool selector (section 4.6.3)
 */

import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@hooks/useTheme';
import {useEditorStore} from '@store/editor';
import {PenTool} from '@constants/drawing';
import {Spacing} from '@theme';
import {SpringConfigs} from '@constants/animations';
import {haptics} from '@utils/haptics';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const tools = [
  {tool: PenTool.Ballpoint, icon: 'create-outline', label: 'Pen'},
  {tool: PenTool.Eraser, icon: 'remove-circle-outline', label: 'Eraser'},
  {tool: PenTool.Highlighter, icon: 'color-fill-outline', label: 'Highlighter'},
  {tool: PenTool.Pencil, icon: 'pencil-outline', label: 'Pencil'},
];

const ToolPalette: React.FC = () => {
  const {theme} = useTheme();
  const {activeTool, setActiveTool} = useEditorStore();

  const handleToolSelect = (tool: PenTool) => {
    haptics.selection();
    setActiveTool(tool);
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.surface + 'CC'}]}>
      {tools.map(({tool, icon}) => (
        <ToolButton
          key={tool}
          icon={icon}
          active={activeTool === tool}
          onPress={() => handleToolSelect(tool)}
        />
      ))}
    </View>
  );
};

interface ToolButtonProps {
  icon: string;
  active: boolean;
  onPress: () => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({icon, active, onPress}) => {
  const {theme} = useTheme();
  const scale = useSharedValue(1);
  const indicatorScale = useSharedValue(active ? 1 : 0);

  React.useEffect(() => {
    indicatorScale.value = withSpring(active ? 1 : 0, SpringConfigs.bouncy);
  }, [active]);

  const handlePressIn = () => {
    scale.value = withSpring(1.15, SpringConfigs.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SpringConfigs.snappy);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{scale: indicatorScale.value}],
    opacity: indicatorScale.value,
  }));

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.toolButton, animatedStyle]}>
      <Animated.View
        style={[
          styles.indicator,
          {backgroundColor: theme.colors.primary},
          indicatorStyle,
        ]}
      />
      <Icon
        name={icon}
        size={28}
        color={active ? theme.colors.primary : theme.colors.textSecondary}
      />
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: '30%',
    width: 72,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  toolButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  indicator: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    opacity: 0.2,
  },
});

export default ToolPalette;
