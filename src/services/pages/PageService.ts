/**
 * Page Service
 * CRUD operations for pages
 */

import {database} from '@database';
import {Page} from '@database/models';
import {Q} from '@nozbe/watermelondb';

export class PageService {
  /**
   * Create a new page
   */
  static async createPage(data: {
    notebookId: string;
    title: string;
    templateType: string;
    backgroundColor: string;
    pageNumber?: number;
  }): Promise<Page> {
    // Get current max page number
    const pages = await database.collections
      .get<Page>('pages')
      .query(Q.where('notebook_id', data.notebookId))
      .fetch();

    const maxPageNumber =
      pages.length > 0
        ? Math.max(...pages.map((p) => p.pageNumber))
        : 0;

    const page = await database.write(async () => {
      return await database.collections
        .get<Page>('pages')
        .create((p) => {
          p.notebookId = data.notebookId;
          p.title = data.title;
          p.templateType = data.templateType;
          p.backgroundColor = data.backgroundColor;
          p.pageNumber = data.pageNumber ?? maxPageNumber + 1;
        });
    });

    return page;
  }

  /**
   * Get all pages in notebook
   */
  static async getPagesByNotebook(notebookId: string): Promise<Page[]> {
    const pages = await database.collections
      .get<Page>('pages')
      .query(
        Q.where('notebook_id', notebookId),
        Q.sortBy('page_number', Q.asc),
      )
      .fetch();

    return pages;
  }

  /**
   * Get page by ID
   */
  static async getPageById(id: string): Promise<Page | null> {
    try {
      const page = await database.collections.get<Page>('pages').find(id);
      return page;
    } catch {
      return null;
    }
  }

  /**
   * Get page by number
   */
  static async getPageByNumber(
    notebookId: string,
    pageNumber: number,
  ): Promise<Page | null> {
    const pages = await database.collections
      .get<Page>('pages')
      .query(
        Q.where('notebook_id', notebookId),
        Q.where('page_number', pageNumber),
      )
      .fetch();

    return pages[0] || null;
  }

  /**
   * Update page
   */
  static async updatePage(
    id: string,
    data: Partial<{
      title: string;
      templateType: string;
      backgroundColor: string;
      thumbnail: string;
    }>,
  ): Promise<Page> {
    const page = await database.collections.get<Page>('pages').find(id);

    await database.write(async () => {
      await page.update((p) => {
        if (data.title !== undefined) p.title = data.title;
        if (data.templateType !== undefined) p.templateType = data.templateType;
        if (data.backgroundColor !== undefined)
          p.backgroundColor = data.backgroundColor;
        if (data.thumbnail !== undefined) p.thumbnail = data.thumbnail;
      });
    });

    return page;
  }

  /**
   * Delete page
   */
  static async deletePage(id: string): Promise<void> {
    const page = await database.collections.get<Page>('pages').find(id);

    await database.write(async () => {
      // Delete all strokes
      const strokes = await page.strokes.fetch();
      for (const stroke of strokes) {
        await stroke.destroyPermanently();
      }

      // Delete all text elements
      const textElements = await page.textElements.fetch();
      for (const text of textElements) {
        await text.destroyPermanently();
      }

      // Delete all images
      const images = await page.images.fetch();
      for (const image of images) {
        await image.destroyPermanently();
      }

      // Delete page
      await page.destroyPermanently();
    });
  }

  /**
   * Reorder pages
   */
  static async reorderPages(
    notebookId: string,
    pageIds: string[],
  ): Promise<void> {
    await database.write(async () => {
      for (let i = 0; i < pageIds.length; i++) {
        const page = await database.collections
          .get<Page>('pages')
          .find(pageIds[i]);
        await page.update((p) => {
          p.pageNumber = i + 1;
        });
      }
    });
  }

  /**
   * Duplicate page
   */
  static async duplicatePage(id: string): Promise<Page> {
    const originalPage = await database.collections
      .get<Page>('pages')
      .find(id);

    const newPage = await this.createPage({
      notebookId: originalPage.notebookId,
      title: `${originalPage.title} (Copy)`,
      templateType: originalPage.templateType,
      backgroundColor: originalPage.backgroundColor,
    });

    // Copy strokes
    const strokes = await originalPage.strokes.fetch();
    await database.write(async () => {
      for (const stroke of strokes) {
        await database.collections.get('strokes').create((s: any) => {
          s.pageId = newPage.id;
          s.toolType = stroke.toolType;
          s.color = stroke.color;
          s.width = stroke.width;
          s.opacity = stroke.opacity;
          s.pointsJson = stroke.pointsJson;
          s.layer = stroke.layer;
          s.boundingBoxJson = stroke.boundingBoxJson;
        });
      }
    });

    return newPage;
  }
}
