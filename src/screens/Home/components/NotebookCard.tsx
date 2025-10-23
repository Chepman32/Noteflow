/**
 * Notebook Card Component
 * Based on section 4.5.3
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useTheme} from '@hooks/useTheme';
import {Typography, Spacing} from '@theme';
import {SpringConfigs} from '@constants/animations';
import {haptics} from '@utils/haptics';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface NotebookCardProps {
  notebook: {
    id: string;
    title: string;
    color: string;
    coverImage?: string;
    pageCount?: number;
    updatedAt?: Date;
  };
  onPress: (id: string) => void;
}

const NotebookCard: React.FC<NotebookCardProps> = ({notebook, onPress}) => {
  const {theme} = useTheme();
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    haptics.light();
    translateY.value = withSpring(-8, SpringConfigs.smooth);
    scale.value = withSpring(1.02, SpringConfigs.smooth);
  };

  const handlePressOut = () => {
    translateY.value = withSpring(0, SpringConfigs.smooth);
    scale.value = withSpring(1, SpringConfigs.smooth);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}, {scale: scale.value}],
    shadowOpacity: 0.08 + translateY.value * -0.01,
  }));

  return (
    <AnimatedTouchable
      onPress={() => onPress(notebook.id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, animatedStyle, {backgroundColor: notebook.color}]}>
      {/* Cover Image Area */}
      <View style={styles.coverArea}>
        {notebook.coverImage ? (
          <Image source={{uri: notebook.coverImage}} style={styles.coverImage} />
        ) : (
          <View style={[styles.defaultCover, {backgroundColor: notebook.color}]} />
        )}
      </View>

      {/* Title Area */}
      <View style={[styles.titleArea, {backgroundColor: theme.colors.surface}]}>
        <Text
          style={[Typography.body, {color: theme.colors.textPrimary}]}
          numberOfLines={2}>
          {notebook.title}
        </Text>
        {notebook.pageCount !== undefined && (
          <Text style={[Typography.caption, {color: theme.colors.textSecondary}]}>
            {notebook.pageCount} pages
          </Text>
        )}
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    maxWidth: '48%',
    aspectRatio: 156 / 220,
  },
  coverArea: {
    flex: 0.6,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  defaultCover: {
    width: '100%',
    height: '100%',
  },
  titleArea: {
    flex: 0.4,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
});

export default NotebookCard;
