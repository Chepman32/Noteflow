/**
 * Editor Screen
 * Main drawing interface (section 4.6.3)
 */

import React, {useRef, useState, useCallback} from 'react';
import {View, StyleSheet, SafeAreaView, Dimensions} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {useTheme} from '@hooks/useTheme';
import {RootStackParamList} from '@navigation/types';
import EditorCanvas from './components/EditorCanvas';
import EditorToolbar from './components/EditorToolbar';
import ToolPalette from './components/ToolPalette';
import PropertyBar from './components/PropertyBar';
import {useEditorStore} from '@store/editor';
import {DrawingEngine} from '@services/drawing/DrawingEngine';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

type EditorScreenRouteProp = RouteProp<RootStackParamList, 'Editor'>;

const EditorScreen: React.FC = () => {
  const route = useRoute<EditorScreenRouteProp>();
  const navigation = useNavigation();
  const {theme} = useTheme();
  const {notebookId, pageId} = route.params;

  const drawingEngineRef = useRef(new DrawingEngine());
  const [pageTitle, setPageTitle] = useState('Untitled Page');

  const {
    activeTool,
    penColor,
    penWidth,
    penOpacity,
    zoom,
    rotation,
    panX,
    panY,
    toolPaletteVisible,
    propertyBarVisible,
  } = useEditorStore();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleUndo = useCallback(() => {
    // TODO: Implement undo
    console.log('Undo');
  }, []);

  const handleRedo = useCallback(() => {
    // TODO: Implement redo
    console.log('Redo');
  }, []);

  const handleShare = useCallback(() => {
    // TODO: Implement share
    console.log('Share');
  }, []);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Top Toolbar */}
      <EditorToolbar
        title={pageTitle}
        onBack={handleBack}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onShare={handleShare}
        visible={toolPaletteVisible}
      />

      {/* Canvas Area */}
      <View style={styles.canvasContainer}>
        <EditorCanvas
          drawingEngine={drawingEngineRef.current}
          tool={activeTool}
          color={penColor}
          width={penWidth}
          opacity={penOpacity}
          zoom={zoom}
          rotation={rotation}
          panX={panX}
          panY={panY}
        />
      </View>

      {/* Tool Palette */}
      {toolPaletteVisible && <ToolPalette />}

      {/* Property Bar */}
      {propertyBarVisible && <PropertyBar />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
  },
});

export default EditorScreen;
