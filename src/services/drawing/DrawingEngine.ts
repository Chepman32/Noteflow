/**
 * Drawing Engine
 * Core drawing functionality using React Native Skia (section 7.1)
 */

import {Skia, SkPath} from '@shopify/react-native-skia';
import {Point, smoothPath, decimatePoints} from '@utils/bezier';
import {PenTool, PenToolConfigs, CanvasConfig} from '@constants/drawing';

export interface StrokeData {
  id: string;
  tool: PenTool;
  color: string;
  width: number;
  opacity: number;
  points: Point[];
  path?: SkPath;
  boundingBox: {x: number; y: number; width: number; height: number};
  layer: 'background' | 'content' | 'foreground';
}

export class DrawingEngine {
  private strokes: Map<string, StrokeData> = new Map();
  private currentStroke: StrokeData | null = null;
  private strokeIdCounter = 0;

  /**
   * Start a new stroke
   */
  startStroke(
    tool: PenTool,
    color: string,
    width: number,
    opacity: number,
    point: Point,
  ): string {
    const strokeId = `stroke_${this.strokeIdCounter++}`;
    const config = PenToolConfigs[tool];

    // Determine layer based on tool
    const layer =
      tool === PenTool.Highlighter
        ? 'background'
        : 'content';

    this.currentStroke = {
      id: strokeId,
      tool,
      color,
      width,
      opacity,
      points: [point],
      layer,
      boundingBox: {x: point.x, y: point.y, width: 0, height: 0},
    };

    return strokeId;
  }

  /**
   * Add point to current stroke
   */
  addPoint(point: Point): void {
    if (!this.currentStroke) return;

    this.currentStroke.points.push(point);

    // Update bounding box
    this.updateBoundingBox(this.currentStroke, point);

    // Rebuild path
    this.currentStroke.path = this.buildPath(this.currentStroke);
  }

  /**
   * End current stroke
   */
  endStroke(): StrokeData | null {
    if (!this.currentStroke) return null;

    // Apply smoothing
    this.currentStroke.points = decimatePoints(
      this.currentStroke.points,
      1,
    );

    // Final path build
    this.currentStroke.path = this.buildPath(this.currentStroke);

    // Save stroke
    this.strokes.set(this.currentStroke.id, this.currentStroke);

    const completedStroke = this.currentStroke;
    this.currentStroke = null;

    return completedStroke;
  }

  /**
   * Build Skia path from points
   */
  private buildPath(stroke: StrokeData): SkPath {
    const path = Skia.Path.Make();
    const {points, width, tool} = stroke;

    if (points.length === 0) return path;

    const config = PenToolConfigs[tool];

    // Start path
    path.moveTo(points[0].x, points[0].y);

    if (points.length === 1) {
      // Single point - draw a small circle
      path.addCircle(points[0].x, points[0].y, width / 2);
      return path;
    }

    // Build path with variable width based on pressure
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];

      // Calculate width based on pressure if available
      let strokeWidth = width;
      if (p1.pressure !== undefined) {
        const pressureResponse = config.pressureResponse || 0.5;
        const minWidthRatio = 1 - pressureResponse;
        strokeWidth = width * (minWidthRatio + p1.pressure * pressureResponse);
      }

      // Use quadratic curve for smoothness
      const midX = (p0.x + p1.x) / 2;
      const midY = (p0.y + p1.y) / 2;
      path.quadTo(p0.x, p0.y, midX, midY);
    }

    // Connect to last point
    const lastPoint = points[points.length - 1];
    path.lineTo(lastPoint.x, lastPoint.y);

    return path;
  }

  /**
   * Update bounding box with new point
   */
  private updateBoundingBox(stroke: StrokeData, point: Point): void {
    const {boundingBox} = stroke;

    if (stroke.points.length === 1) {
      // First point
      boundingBox.x = point.x;
      boundingBox.y = point.y;
      boundingBox.width = 0;
      boundingBox.height = 0;
    } else {
      // Expand bounding box
      const minX = Math.min(boundingBox.x, point.x);
      const minY = Math.min(boundingBox.y, point.y);
      const maxX = Math.max(boundingBox.x + boundingBox.width, point.x);
      const maxY = Math.max(boundingBox.y + boundingBox.height, point.y);

      boundingBox.x = minX;
      boundingBox.y = minY;
      boundingBox.width = maxX - minX;
      boundingBox.height = maxY - minY;
    }
  }

  /**
   * Get stroke by ID
   */
  getStroke(id: string): StrokeData | undefined {
    return this.strokes.get(id);
  }

  /**
   * Get all strokes
   */
  getAllStrokes(): StrokeData[] {
    return Array.from(this.strokes.values());
  }

  /**
   * Remove stroke
   */
  removeStroke(id: string): void {
    this.strokes.delete(id);
  }

  /**
   * Clear all strokes
   */
  clear(): void {
    this.strokes.clear();
    this.currentStroke = null;
  }

  /**
   * Get current stroke (in progress)
   */
  getCurrentStroke(): StrokeData | null {
    return this.currentStroke;
  }

  /**
   * Check if point is inside stroke bounding box (for hit testing)
   */
  isPointInStroke(strokeId: string, x: number, y: number): boolean {
    const stroke = this.strokes.get(strokeId);
    if (!stroke) return false;

    const {boundingBox, width} = stroke;
    const margin = width; // Add margin for easier selection

    return (
      x >= boundingBox.x - margin &&
      x <= boundingBox.x + boundingBox.width + margin &&
      y >= boundingBox.y - margin &&
      y <= boundingBox.y + boundingBox.height + margin
    );
  }

  /**
   * Get strokes in viewport (for culling)
   */
  getStrokesInViewport(
    viewportX: number,
    viewportY: number,
    viewportWidth: number,
    viewportHeight: number,
    margin: number = 0.2,
  ): StrokeData[] {
    const marginX = viewportWidth * margin;
    const marginY = viewportHeight * margin;

    return this.getAllStrokes().filter((stroke) => {
      const {boundingBox} = stroke;

      // Check if bounding boxes intersect
      return !(
        boundingBox.x + boundingBox.width < viewportX - marginX ||
        boundingBox.x > viewportX + viewportWidth + marginX ||
        boundingBox.y + boundingBox.height < viewportY - marginY ||
        boundingBox.y > viewportY + viewportHeight + marginY
      );
    });
  }
}
