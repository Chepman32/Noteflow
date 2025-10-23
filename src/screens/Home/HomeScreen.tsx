/**
 * Home Screen
 * Main screen with notebook grid and FAB (section 4.6.2)
 */

import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@hooks/useTheme';
import {Typography, Spacing} from '@theme';
import {IconButton} from '@components/common/IconButton';
import {Button} from '@components/common/Button';
import NotebookCard from './components/NotebookCard';
import FAB from './components/FAB';

const HomeScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [notebooks, setNotebooks] = useState<any[]>([]);

  const handleCreateNotebook = () => {
    // TODO: Implement notebook creation
    console.log('Create notebook');
  };

  const handleOpenNotebook = (notebookId: string) => {
    navigation.navigate('Editor', {notebookId});
  };

  const handleSearch = () => {
    navigation.navigate('Search');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Navigation Bar */}
      <View style={[styles.navbar, {backgroundColor: theme.colors.surface}]}>
        <IconButton name="menu" onPress={() => {}} />
        <Text style={[Typography.headline, {color: theme.colors.textPrimary}]}>
          NoteFlow
        </Text>
        <View style={styles.navbarRight}>
          <IconButton name="search" onPress={handleSearch} />
          <IconButton name="settings-outline" onPress={handleSettings} />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <QuickActionButton
          icon="document-text-outline"
          label="New Note"
          color={theme.colors.primary}
          onPress={() => {}}
        />
        <QuickActionButton
          icon="folder-outline"
          label="New Notebook"
          color={theme.colors.accent}
          onPress={handleCreateNotebook}
        />
        <QuickActionButton
          icon="scan-outline"
          label="Scan"
          color={theme.colors.secondary}
          onPress={() => {}}
        />
        <QuickActionButton
          icon="mic-outline"
          label="Voice Note"
          color={theme.colors.info}
          onPress={() => {}}
        />
      </View>

      {/* Notebooks Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[Typography.title, {color: theme.colors.textPrimary}]}>
            My Notebooks
          </Text>
          <Button title="View All" variant="text" onPress={() => {}} />
        </View>

        {notebooks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[Typography.body, {color: theme.colors.textSecondary}]}>
              No notebooks yet. Create your first notebook to get started!
            </Text>
            <Button
              title="Create Notebook"
              onPress={handleCreateNotebook}
              style={{marginTop: Spacing.lg}}
            />
          </View>
        ) : (
          <FlatList
            data={notebooks}
            renderItem={({item}) => (
              <NotebookCard notebook={item} onPress={handleOpenNotebook} />
            )}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.grid}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <FAB onPress={handleCreateNotebook} />
    </SafeAreaView>
  );
};

// Quick Action Button Component
const QuickActionButton: React.FC<{
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}> = ({icon, label, color, onPress}) => {
  const {theme} = useTheme();

  return (
    <View style={styles.quickActionButton}>
      <View
        style={[
          styles.quickActionCircle,
          {backgroundColor: color, shadowColor: color},
        ]}>
        <IconButton name={icon} color="#FFFFFF" onPress={onPress} />
      </View>
      <Text style={[Typography.caption, {color: theme.colors.textSecondary}]}>
        {label}
      </Text>
    </View>
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  quickActionButton: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  quickActionCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  section: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  grid: {
    gap: Spacing.md,
  },
  listContent: {
    paddingBottom: 100, // Space for FAB
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
});

export default HomeScreen;
