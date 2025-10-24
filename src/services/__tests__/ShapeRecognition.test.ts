/**
 * Shape Recognition Tests
 */

import {ShapeRecognition, RecognizedShape} from '../shapes/ShapeRecognition';
import {Point} from '@utils/bezier';

describe('ShapeRecognition', () => {
  let recognizer: ShapeRecognition;

  beforeEach(() => {
    recognizer = new ShapeRecognition();
  });

  describe('Line Recognition', () => {
    it('should recognize straight line', () => {
      const points: Point[] = [];
      for (let i = 0; i <= 100; i++) {
        points.push({x: i, y: 50});
      }

      const result = recognizer.recognize(points);

      expect(result.type).toBe(RecognizedShape.Line);
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should not recognize curved line', () => {
      const points: Point[] = [];
      for (let i = 0; i <= 100; i++) {
        const angle = (i / 100) * Math.PI;
        points.push({x: i, y: 50 + Math.sin(angle) * 20});
      }

      const result = recognizer.recognize(points);

      expect(result.type).not.toBe(RecognizedShape.Line);
    });
  });

  describe('Circle Recognition', () => {
    it('should recognize perfect circle', () => {
      const points: Point[] = [];
      const radius = 50;
      const center = {x: 100, y: 100};

      for (let i = 0; i < 100; i++) {
        const angle = (i / 100) * 2 * Math.PI;
        points.push({
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius,
        });
      }

      const result = recognizer.recognize(points);

      expect(result.type).toBe(RecognizedShape.Circle);
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.radius).toBeCloseTo(radius, 5);
    });
  });

  describe('Rectangle Recognition', () => {
    it('should recognize rectangle', () => {
      const points: Point[] = [
        // Top edge
        ...Array.from({length: 25}, (_, i) => ({x: i * 4, y: 0})),
        // Right edge
        ...Array.from({length: 25}, (_, i) => ({x: 100, y: i * 3})),
        // Bottom edge
        ...Array.from({length: 25}, (_, i) => ({x: 100 - i * 4, y: 75})),
        // Left edge
        ...Array.from({length: 25}, (_, i) => ({x: 0, y: 75 - i * 3})),
      ];

      const result = recognizer.recognize(points);

      expect(result.type).toBe(RecognizedShape.Rectangle);
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should recognize square', () => {
      const points: Point[] = [
        ...Array.from({length: 25}, (_, i) => ({x: i * 4, y: 0})),
        ...Array.from({length: 25}, (_, i) => ({x: 100, y: i * 4})),
        ...Array.from({length: 25}, (_, i) => ({x: 100 - i * 4, y: 100})),
        ...Array.from({length: 25}, (_, i) => ({x: 0, y: 100 - i * 4})),
      ];

      const result = recognizer.recognize(points);

      expect(result.type).toBe(RecognizedShape.Square);
    });
  });

  describe('Triangle Recognition', () => {
    it('should recognize triangle', () => {
      const points: Point[] = [
        ...Array.from({length: 30}, (_, i) => ({
          x: i * 2,
          y: 0,
        })),
        ...Array.from({length: 30}, (_, i) => ({
          x: 60 - i,
          y: i * 3,
        })),
        ...Array.from({length: 30}, (_, i) => ({
          x: 30 - i,
          y: 90 - i * 3,
        })),
      ];

      const result = recognizer.recognize(points);

      expect(result.type).toBe(RecognizedShape.Triangle);
    });
  });

  describe('No Recognition', () => {
    it('should return none for random points', () => {
      const points: Point[] = Array.from({length: 50}, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));

      const result = recognizer.recognize(points);

      expect(result.type).toBe(RecognizedShape.None);
    });

    it('should return none for too few points', () => {
      const points: Point[] = [{x: 0, y: 0}, {x: 10, y: 10}];

      const result = recognizer.recognize(points);

      expect(result.type).toBe(RecognizedShape.None);
    });
  });
});
