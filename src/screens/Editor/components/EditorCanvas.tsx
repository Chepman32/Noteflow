/**
 * Editor Canvas Component
 * Skia-based drawing canvas with gesture support
 */

import React, {useCallback} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {Canvas, Path, Skia, Paint} from '@shopify/react-native-skia';
import {Gesture, GestureDetector, GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {DrawingEngine, StrokeData} from '@services/drawing/DrawingEngine';
import {PenTool} from '@constants/drawing';
import {SpringConfigs} from '@constants/animations';
import {haptics} from '@utils/haptics';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

interface EditorCanvasProps {
  drawingEngine: DrawingEngine;
  tool: PenTool;
  color: string;
  width: number;
  opacity: number;
  zoom: number;
  rotation: number;
  panX: number;
  panY: number;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  drawingEngine,
  tool,
  color,
  width,
  opacity,
  zoom,
  rotation,
  panX,
  panY,
}) => {
  const [strokes, setStrokes] = React.useState<StrokeData[]>([]);
  const [currentStroke, setCurrentStroke] = React.useState<StrokeData | null>(null);

  const canvasScale = useSharedValue(zoom);
  const canvasRotation = useSharedValue(rotation);
  const translateX = useSharedValue(panX);
  const translateY = useSharedValue(panY);

  // Drawing gesture
  const drawGesture = Gesture.Pan()
    .onStart((event) => {
      // Start new stroke
      const strokeId = drawingEngine.startStroke(tool, color, width, opacity, {
        x: event.x,
        y: event.y,
        pressure: event.pressure || 1.0,
        timestamp: Date.now(),
      });

      const stroke = drawingEngine.getCurrentStroke();
      if (stroke) {
        setCurrentStroke(stroke);
      }
    })
    .onUpdate((event) => {
      // Add point to stroke
      drawingEngine.addPoint({
        x: event.x,
        y: event.y,
        pressure: event.pressure || 1.0,
        timestamp: Date.now(),
      });

      const stroke = drawingEngine.getCurrentStroke();
      if (stroke) {
        setCurrentStroke({...stroke});
      }
    })
    .onEnd(() => {
      // End stroke
      const completedStroke = drawingEngine.endStroke();
      if (completedStroke) {
        setStrokes([...drawingEngine.getAllStrokes()]);
        setCurrentStroke(null);
        haptics.light();
      }
    });

  // Pinch gesture for zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      canvasScale.value = Math.max(0.5, Math.min(4.0, event.scale));
    })
    .onEnd(() => {
      canvasScale.value = withSpring(
        Math.round(canvasScale.value * 10) / 10,
        SpringConfigs.fluid,
      );
    });

  // Rotation gesture
  const rotationGesture = Gesture.Rotation()
    .onUpdate((event) => {
      canvasRotation.value = event.rotation * (180 / Math.PI);
    })
    .onEnd(() => {
      // Snap to 0, 90, 180, 270
      const snapAngles = [0, 90, 180, 270];
      const normalized = ((canvasRotation.value % 360) + 360) % 360;
      const nearest = snapAngles.reduce((prev, curr) =>
        Math.abs(curr - normalized) < Math.abs(prev - normalized) ? curr : prev,
      );

      if (Math.abs(nearest - normalized) < 15) {
        canvasRotation.value = withSpring(nearest, SpringConfigs.fluid);
        haptics.medium();
      }
    });

  // Pan gesture (two fingers)
  const panGesture = Gesture.Pan()
    .minPointers(2)
    .onUpdate((event) => {
      translateX.value += event.translationX;
      translateY.value += event.translationY;
    });

  // Composite gesture
  const composedGesture = Gesture.Race(
    drawGesture,
    Gesture.Simultaneous(pinchGesture, rotationGesture, panGesture),
  );

  const canvasStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
      {scale: canvasScale.value},
      {rotate: `${canvasRotation.value}deg`},
    ],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.canvasWrapper, canvasStyle]}>
          <Canvas style={styles.canvas}>
            {/* Render completed strokes */}
            {strokes.map((stroke) => {
              if (!stroke.path) return null;

              const paint = Skia.Paint();
              paint.setColor(Skia.Color(stroke.color));
              paint.setStrokeWidth(stroke.width);
              paint.setStyle(1); // Stroke style
              paint.setStrokeCap(1); // Round cap
              paint.setStrokeJoin(1); // Round join
              paint.setAlphaf(stroke.opacity);
              paint.setAntiAlias(true);

              return <Path key={stroke.id} path={stroke.path} paint={paint} />;
            })}

            {/* Render current stroke (in progress) */}
            {currentStroke && currentStroke.path && (
              <Path
                path={currentStroke.path}
                color={currentStroke.color}
                style="stroke"
                strokeWidth={currentStroke.width}
                strokeCap="round"
                strokeJoin="round"
                opacity={currentStroke.opacity}
              />
            )}
          </Canvas>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasWrapper: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default EditorCanvas;
