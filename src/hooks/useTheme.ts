/**
 * Theme Hook
 */

import {useColorScheme} from 'react-native';
import {Theme, ThemeMode} from '@theme';
import {useSettingsStore} from '@store/settings';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const {themeMode} = useSettingsStore();

  // Determine effective theme mode
  const effectiveMode: ThemeMode =
    themeMode === 'auto' ? (systemColorScheme === 'dark' ? 'dark' : 'light') : themeMode;

  const theme = Theme[effectiveMode];
  const isDark = effectiveMode === 'dark';

  return {
    theme,
    isDark,
    mode: effectiveMode,
  };
};
