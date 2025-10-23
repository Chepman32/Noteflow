/**
 * NoteFlow - Main App Component
 * A Gesture-Driven Digital Note-Taking Application
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {RootNavigator} from './navigation/RootNavigator';
import {useTheme} from './hooks/useTheme';

const App: React.FC = () => {
  const {isDark} = useTheme();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <RootNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
