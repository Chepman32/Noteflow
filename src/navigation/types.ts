/**
 * Navigation Types
 */

import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Editor: {
    notebookId: string;
    pageId?: string;
  };
  Search: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Library: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
