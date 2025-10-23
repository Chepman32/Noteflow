/**
 * Editor Store
 * Manages editor state (active tool, colors, etc.)
 */

import {create} from 'zustand';
import {PenTool, EraserMode} from '@constants/drawing';

export interface EditorState {
  // Active tool
  activeTool: PenTool;
  previousTool: PenTool; // For quick toggle (e.g., Apple Pencil double-tap)

  // Pen properties
  penColor: string;
  penWidth: number;
  penOpacity: number;

  // Eraser properties
  eraserMode: EraserMode;
  eraserWidth: number;

  // Canvas state
  zoom: number;
  rotation: number;
  panX: number;
  panY: number;

  // UI state
  toolPaletteVisible: boolean;
  propertyBarVisible: boolean;

  // Actions
  setActiveTool: (tool: PenTool) => void;
  toggleTool: () => void; // Toggle between active and previous tool
  setPenColor: (color: string) => void;
  setPenWidth: (width: number) => void;
  setPenOpacity: (opacity: number) => void;
  setEraserMode: (mode: EraserMode) => void;
  setEraserWidth: (width: number) => void;
  setZoom: (zoom: number) => void;
  setRotation: (rotation: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;
  setToolPaletteVisible: (visible: boolean) => void;
  setPropertyBarVisible: (visible: boolean) => void;
  toggleToolbars: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  activeTool: PenTool.Ballpoint,
  previousTool: PenTool.Ballpoint,
  penColor: '#000000',
  penWidth: 2,
  penOpacity: 1,
  eraserMode: EraserMode.Stroke,
  eraserWidth: 20,
  zoom: 1.0,
  rotation: 0,
  panX: 0,
  panY: 0,
  toolPaletteVisible: true,
  propertyBarVisible: true,

  setActiveTool: (tool) => {
    const currentTool = get().activeTool;
    set({
      activeTool: tool,
      previousTool: currentTool,
    });
  },

  toggleTool: () => {
    const {activeTool, previousTool} = get();
    set({
      activeTool: previousTool,
      previousTool: activeTool,
    });
  },

  setPenColor: (color) => set({penColor: color}),
  setPenWidth: (width) => set({penWidth: width}),
  setPenOpacity: (opacity) => set({penOpacity: opacity}),
  setEraserMode: (mode) => set({eraserMode: mode}),
  setEraserWidth: (width) => set({eraserWidth: width}),
  setZoom: (zoom) => set({zoom}),
  setRotation: (rotation) => set({rotation}),
  setPan: (x, y) => set({panX: x, panY: y}),

  resetView: () =>
    set({
      zoom: 1.0,
      rotation: 0,
      panX: 0,
      panY: 0,
    }),

  setToolPaletteVisible: (visible) => set({toolPaletteVisible: visible}),
  setPropertyBarVisible: (visible) => set({propertyBarVisible: visible}),

  toggleToolbars: () => {
    const {toolPaletteVisible, propertyBarVisible} = get();
    const newVisible = !toolPaletteVisible;
    set({
      toolPaletteVisible: newVisible,
      propertyBarVisible: newVisible,
    });
  },
}));
