/**
 * Settings Store
 * Global app settings using Zustand
 */

import {create} from 'zustand';
import {MMKV} from 'react-native-mmkv';
import {PalmRejectionSensitivity, PressureCurve} from '@constants/drawing';

const storage = new MMKV({
  id: 'noteflow-settings',
});

export interface SettingsState {
  // Appearance
  themeMode: 'light' | 'dark' | 'auto';

  // Editor
  defaultPenWidth: number;
  defaultPenColor: string;
  palmRejectionSensitivity: PalmRejectionSensitivity;
  pressureCurve: PressureCurve;
  smoothingTension: number;

  // Export
  defaultExportFormat: 'pdf' | 'png' | 'jpg';
  exportQuality: number; // 0-100

  // Premium
  isPremium: boolean;

  // Actions
  setThemeMode: (mode: 'light' | 'dark' | 'auto') => void;
  setDefaultPenWidth: (width: number) => void;
  setDefaultPenColor: (color: string) => void;
  setPalmRejectionSensitivity: (sensitivity: PalmRejectionSensitivity) => void;
  setPressureCurve: (curve: PressureCurve) => void;
  setSmoothingTension: (tension: number) => void;
  setDefaultExportFormat: (format: 'pdf' | 'png' | 'jpg') => void;
  setExportQuality: (quality: number) => void;
  setIsPremium: (isPremium: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  // Load from MMKV or use defaults
  themeMode: (storage.getString('themeMode') as 'light' | 'dark' | 'auto') ?? 'auto',
  defaultPenWidth: storage.getNumber('defaultPenWidth') ?? 2,
  defaultPenColor: storage.getString('defaultPenColor') ?? '#000000',
  palmRejectionSensitivity:
    (storage.getString('palmRejectionSensitivity') as PalmRejectionSensitivity) ??
    PalmRejectionSensitivity.Medium,
  pressureCurve:
    (storage.getString('pressureCurve') as PressureCurve) ?? PressureCurve.Linear,
  smoothingTension: storage.getNumber('smoothingTension') ?? 0.5,
  defaultExportFormat:
    (storage.getString('defaultExportFormat') as 'pdf' | 'png' | 'jpg') ?? 'pdf',
  exportQuality: storage.getNumber('exportQuality') ?? 90,
  isPremium: storage.getBoolean('isPremium') ?? false,

  setThemeMode: (mode) => {
    storage.set('themeMode', mode);
    set({themeMode: mode});
  },

  setDefaultPenWidth: (width) => {
    storage.set('defaultPenWidth', width);
    set({defaultPenWidth: width});
  },

  setDefaultPenColor: (color) => {
    storage.set('defaultPenColor', color);
    set({defaultPenColor: color});
  },

  setPalmRejectionSensitivity: (sensitivity) => {
    storage.set('palmRejectionSensitivity', sensitivity);
    set({palmRejectionSensitivity: sensitivity});
  },

  setPressureCurve: (curve) => {
    storage.set('pressureCurve', curve);
    set({pressureCurve: curve});
  },

  setSmoothingTension: (tension) => {
    storage.set('smoothingTension', tension);
    set({smoothingTension: tension});
  },

  setDefaultExportFormat: (format) => {
    storage.set('defaultExportFormat', format);
    set({defaultExportFormat: format});
  },

  setExportQuality: (quality) => {
    storage.set('exportQuality', quality);
    set({exportQuality: quality});
  },

  setIsPremium: (isPremium) => {
    storage.set('isPremium', isPremium);
    set({isPremium: isPremium});
  },
}));
