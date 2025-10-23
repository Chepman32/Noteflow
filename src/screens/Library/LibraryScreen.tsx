/**
 * Library Screen
 * Browse all notebooks and folders (section 4.6.4)
 */

import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography, Spacing} from '@theme';
import {IconButton} from '@components/common/IconButton';
import {Button} from '@components/common/Button';

const LibraryScreen: React.FC = () => {
  const {theme} = useTheme();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [notebooks, setNotebooks] = useState<any[]>([]);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Navigation Bar */}
      <View style={[styles.navbar, {backgroundColor: theme.colors.surface}]}>
        <Text style={[Typography.headline, {color: theme.colors.textPrimary}]}>
          Library
        </Text>
        <View style={styles.navbarRight}>
          <IconButton
            name={viewMode === 'grid' ? 'list' : 'grid'}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          />
          <IconButton name="filter-outline" onPress={() => {}} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {notebooks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[Typography.body, {color: theme.colors.textSecondary}]}>
              No notebooks in library
            </Text>
          </View>
        ) : (
          <FlatList
            data={notebooks}
            renderItem={({item}) => <View />}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  navbarRight: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LibraryScreen;
