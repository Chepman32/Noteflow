/**
 * Search Screen
 * Search across notebooks and pages (section 4.6.5)
 */

import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TextInput, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@hooks/useTheme';
import {Typography, Spacing} from '@theme';
import {IconButton} from '@components/common/IconButton';

const SearchScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Search Bar */}
      <View style={[styles.searchBar, {backgroundColor: theme.colors.surface}]}>
        <IconButton name="search" onPress={() => {}} />
        <TextInput
          style={[
            Typography.body,
            {flex: 1, color: theme.colors.textPrimary},
          ]}
          placeholder="Search notes..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
        {searchQuery.length > 0 && (
          <IconButton name="close" onPress={() => setSearchQuery('')} />
        )}
      </View>

      {/* Results */}
      <View style={styles.content}>
        {results.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[Typography.body, {color: theme.colors.textSecondary}]}>
              {searchQuery.length > 0 ? 'No results found' : 'Search your notes'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
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

export default SearchScreen;
