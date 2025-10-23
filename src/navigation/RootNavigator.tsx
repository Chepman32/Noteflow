/**
 * Root Navigator
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {RootStackParamList} from './types';
import {useTheme} from '@hooks/useTheme';

// Screens
import SplashScreen from '@screens/Splash/SplashScreen';
import OnboardingScreen from '@screens/Onboarding/OnboardingScreen';
import MainNavigator from './MainNavigator';
import EditorScreen from '@screens/Editor/EditorScreen';
import SearchScreen from '@screens/Search/SearchScreen';
import SettingsScreen from '@screens/Settings/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const {theme} = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.textPrimary,
          border: theme.colors.border,
          notification: theme.colors.accent,
        },
      }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={MainNavigator} />
        <Stack.Screen
          name="Editor"
          component={EditorScreen}
          options={{
            gestureEnabled: false, // Disable gesture to avoid conflicts with drawing
          }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
