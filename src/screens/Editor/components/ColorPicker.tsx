/**
 * Color Picker Component
 * Horizontal color selector
 */

import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {InkColors} from '@theme/colors';
import {SpringConfigs} from '@constants/animations';
import {haptics} from '@utils/haptics';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({value, onChange}) => {
  const basicColors = InkColors.basics;

  const handleColorSelect = (color: string) => {
    haptics.selection();
    onChange(color);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.colorRow}>
          {basicColors.map((color) => (
            <ColorSwatch
              key={color}
              color={color}
              selected={value === color}
              onPress={handleColorSelect}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

interface ColorSwatchProps {
  color: string;
  selected: boolean;
  onPress: (color: string) => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({color, selected, onPress}) => {
  const scale = useSharedValue(selected ? 1 : 0.9);

  React.useEffect(() => {
    scale.value = withSpring(selected ? 1 : 0.9, SpringConfigs.snappy);
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.85, SpringConfigs.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(selected ? 1 : 0.9, SpringConfigs.snappy);
  };

  return (
    <AnimatedTouchable
      onPress={() => onPress(color)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.swatch, animatedStyle]}>
      <View
        style={[
          styles.swatchInner,
          {backgroundColor: color},
          selected && styles.swatchSelected,
        ]}
      />
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {},
  colorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default ColorPicker;
