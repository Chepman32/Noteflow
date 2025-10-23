/**
 * Onboarding Screen
 * First-time user onboarding
 */

import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@hooks/useTheme';
import {Typography, Spacing} from '@theme';
import {Button} from '@components/common/Button';

const OnboardingScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Main' as never}],
    });
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.content}>
        <Text style={[Typography.displayLarge, {color: theme.colors.textPrimary}]}>
          Welcome to NoteFlow
        </Text>
        <Text
          style={[
            Typography.body,
            {color: theme.colors.textSecondary, marginTop: Spacing.lg},
          ]}>
          Your ideas, beautifully organized
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  footer: {
    padding: Spacing.xl,
  },
});

export default OnboardingScreen;
