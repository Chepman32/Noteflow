/**
 * Export Service
 * Export pages to PDF, PNG, JPG
 */

import {Page} from '@database/models';
import {Skia, Canvas as SkiaCanvas} from '@shopify/react-native-skia';
import RNFS from 'react-native-fs';
import {Platform, Share} from 'react-native';

export type ExportFormat = 'pdf' | 'png' | 'jpg';

export interface ExportOptions {
  format: ExportFormat;
  quality?: number; // 0-100 for JPG
  includeBackground?: boolean;
  scale?: number; // Resolution multiplier
}

export class ExportService {
  /**
   * Export single page
   */
  static async exportPage(
    page: Page,
    options: ExportOptions,
  ): Promise<string> {
    const {format, quality = 90, includeBackground = true, scale = 2} = options;

    // Render page to image
    const imageData = await this.renderPageToImage(page, scale, includeBackground);

    // Save to file
    const filename = `${page.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.${format}`;
    const filepath = `${RNFS.CachesDirectoryPath}/${filename}`;

    if (format === 'pdf') {
      // Convert to PDF (simplified - would use actual PDF library)
      await RNFS.writeFile(filepath, imageData, 'base64');
    } else {
      // Save as image
      await RNFS.writeFile(filepath, imageData, 'base64');
    }

    return filepath;
  }

  /**
   * Export multiple pages
   */
  static async exportPages(
    pages: Page[],
    options: ExportOptions,
  ): Promise<string[]> {
    const filepaths: string[] = [];

    for (const page of pages) {
      const filepath = await this.exportPage(page, options);
      filepaths.push(filepath);
    }

    return filepaths;
  }

  /**
   * Export notebook (all pages)
   */
  static async exportNotebook(
    notebookId: string,
    options: ExportOptions,
  ): Promise<string[]> {
    const {PageService} = require('@services/pages/PageService');
    const pages = await PageService.getPagesByNotebook(notebookId);

    return await this.exportPages(pages, options);
  }

  /**
   * Render page to image data
   */
  private static async renderPageToImage(
    page: Page,
    scale: number,
    includeBackground: boolean,
  ): Promise<string> {
    const width = 800 * scale;
    const height = 1200 * scale;

    // Create Skia surface
    const surface = Skia.Surface.Make(width, height);
    if (!surface) {
      throw new Error('Failed to create surface');
    }

    const canvas = surface.getCanvas();

    // Draw background
    if (includeBackground) {
      const paint = Skia.Paint();
      paint.setColor(Skia.Color(page.backgroundColor || '#FFFFFF'));
      canvas.drawRect(Skia.XYWHRect(0, 0, width, height), paint);
    }

    // Draw template
    // TODO: Render template pattern

    // Draw all strokes
    const strokes = await page.strokes.fetch();
    for (const stroke of strokes) {
      const paint = Skia.Paint();
      paint.setColor(Skia.Color(stroke.color));
      paint.setStrokeWidth(stroke.width * scale);
      paint.setStyle(1); // Stroke
      paint.setStrokeCap(1); // Round
      paint.setStrokeJoin(1); // Round
      paint.setAlphaf(stroke.opacity);
      paint.setAntiAlias(true);

      const points = stroke.points;
      if (points.length > 0) {
        const path = Skia.Path.Make();
        path.moveTo(points[0].x * scale, points[0].y * scale);

        for (let i = 1; i < points.length; i++) {
          path.lineTo(points[i].x * scale, points[i].y * scale);
        }

        canvas.drawPath(path, paint);
      }
    }

    // Get image data
    const image = surface.makeImageSnapshot();
    const data = image.encodeToBase64();

    return data;
  }

  /**
   * Share exported file
   */
  static async shareFile(filepath: string): Promise<void> {
    try {
      await Share.share({
        url: Platform.OS === 'ios' ? filepath : `file://${filepath}`,
        title: 'Share Note',
      });
    } catch (error) {
      console.error('Error sharing file:', error);
      throw error;
    }
  }

  /**
   * Save to Photos (iOS)
   */
  static async saveToPhotos(filepath: string): Promise<void> {
    // Would use CameraRoll.save()
    console.log('Saving to photos:', filepath);
  }

  /**
   * Get export file size
   */
  static async getFileSize(filepath: string): Promise<number> {
    const stat = await RNFS.stat(filepath);
    return stat.size;
  }

  /**
   * Delete exported file
   */
  static async deleteExportedFile(filepath: string): Promise<void> {
    await RNFS.unlink(filepath);
  }
}
