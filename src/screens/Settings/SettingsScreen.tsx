/**
 * Settings Screen
 * App settings and preferences (section 4.6.6)
 */

import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, Switch} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@hooks/useTheme';
import {useSettingsStore} from '@store/settings';
import {Typography, Spacing} from '@theme';
import {IconButton} from '@components/common/IconButton';
import {Card} from '@components/common/Card';

const SettingsScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {
    themeMode,
    setThemeMode,
    palmRejectionSensitivity,
    setPalmRejectionSensitivity,
    isPremium,
  } = useSettingsStore();

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Navigation Bar */}
      <View style={[styles.navbar, {backgroundColor: theme.colors.surface}]}>
        <IconButton name="close" onPress={() => navigation.goBack()} />
        <Text style={[Typography.headline, {color: theme.colors.textPrimary}]}>
          Settings
        </Text>
        <View style={{width: 44}} />
      </View>

      <ScrollView style={styles.content}>
        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[Typography.title, {color: theme.colors.textPrimary}]}>
            Appearance
          </Text>
          <Card style={{marginTop: Spacing.md}}>
            <SettingRow
              label="Theme"
              value={themeMode}
              onPress={() => {}}
            />
          </Card>
        </View>

        {/* Editor */}
        <View style={styles.section}>
          <Text style={[Typography.title, {color: theme.colors.textPrimary}]}>
            Editor
          </Text>
          <Card style={{marginTop: Spacing.md}}>
            <SettingRow
              label="Palm Rejection"
              value={palmRejectionSensitivity}
              onPress={() => {}}
            />
          </Card>
        </View>

        {/* Premium */}
        {!isPremium && (
          <View style={styles.section}>
            <Text style={[Typography.title, {color: theme.colors.textPrimary}]}>
              Premium
            </Text>
            <Card style={{marginTop: Spacing.md}}>
              <Text style={[Typography.body, {color: theme.colors.textSecondary}]}>
                Upgrade to premium for unlimited features
              </Text>
            </Card>
          </View>
        )}

        {/* About */}
        <View style={styles.section}>
          <Text style={[Typography.title, {color: theme.colors.textPrimary}]}>
            About
          </Text>
          <Card style={{marginTop: Spacing.md}}>
            <Text style={[Typography.body, {color: theme.colors.textSecondary}]}>
              NoteFlow v1.0.0
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface SettingRowProps {
  label: string;
  value: string;
  onPress: () => void;
}

const SettingRow: React.FC<SettingRowProps> = ({label, value, onPress}) => {
  const {theme} = useTheme();

  return (
    <View style={styles.settingRow}>
      <Text style={[Typography.body, {color: theme.colors.textPrimary}]}>
        {label}
      </Text>
      <Text style={[Typography.body, {color: theme.colors.textSecondary}]}>
        {value}
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
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
});

export default SettingsScreen;
