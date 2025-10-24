/**
 * Notebook Service
 * CRUD operations for notebooks
 */

import {database} from '@database';
import {Notebook} from '@database/models';
import {Q} from '@nozbe/watermelondb';

export class NotebookService {
  /**
   * Create a new notebook
   */
  static async createNotebook(data: {
    title: string;
    color: string;
    coverImage?: string;
    folderId?: string;
  }): Promise<Notebook> {
    const notebook = await database.write(async () => {
      return await database.collections
        .get<Notebook>('notebooks')
        .create((nb) => {
          nb.title = data.title;
          nb.color = data.color;
          nb.coverImage = data.coverImage;
          nb.folderId = data.folderId;
          nb.isFavorite = false;
        });
    });

    return notebook;
  }

  /**
   * Get all notebooks
   */
  static async getAllNotebooks(): Promise<Notebook[]> {
    const notebooks = await database.collections
      .get<Notebook>('notebooks')
      .query()
      .fetch();

    return notebooks;
  }

  /**
   * Get notebook by ID
   */
  static async getNotebookById(id: string): Promise<Notebook | null> {
    try {
      const notebook = await database.collections
        .get<Notebook>('notebooks')
        .find(id);
      return notebook;
    } catch {
      return null;
    }
  }

  /**
   * Get notebooks by folder
   */
  static async getNotebooksByFolder(folderId?: string): Promise<Notebook[]> {
    const query = folderId
      ? database.collections
          .get<Notebook>('notebooks')
          .query(Q.where('folder_id', folderId))
      : database.collections
          .get<Notebook>('notebooks')
          .query(Q.where('folder_id', null));

    return await query.fetch();
  }

  /**
   * Get favorite notebooks
   */
  static async getFavoriteNotebooks(): Promise<Notebook[]> {
    const notebooks = await database.collections
      .get<Notebook>('notebooks')
      .query(Q.where('is_favorite', true))
      .fetch();

    return notebooks;
  }

  /**
   * Update notebook
   */
  static async updateNotebook(
    id: string,
    data: Partial<{
      title: string;
      color: string;
      coverImage: string;
      folderId: string;
      isFavorite: boolean;
    }>,
  ): Promise<Notebook> {
    const notebook = await database.collections
      .get<Notebook>('notebooks')
      .find(id);

    await database.write(async () => {
      await notebook.update((nb) => {
        if (data.title !== undefined) nb.title = data.title;
        if (data.color !== undefined) nb.color = data.color;
        if (data.coverImage !== undefined) nb.coverImage = data.coverImage;
        if (data.folderId !== undefined) nb.folderId = data.folderId;
        if (data.isFavorite !== undefined) nb.isFavorite = data.isFavorite;
      });
    });

    return notebook;
  }

  /**
   * Toggle favorite
   */
  static async toggleFavorite(id: string): Promise<Notebook> {
    const notebook = await database.collections
      .get<Notebook>('notebooks')
      .find(id);

    await database.write(async () => {
      await notebook.update((nb) => {
        nb.isFavorite = !nb.isFavorite;
      });
    });

    return notebook;
  }

  /**
   * Delete notebook
   */
  static async deleteNotebook(id: string): Promise<void> {
    const notebook = await database.collections
      .get<Notebook>('notebooks')
      .find(id);

    await database.write(async () => {
      // Delete all pages in notebook
      const pages = await notebook.pages.fetch();
      for (const page of pages) {
        await page.destroyPermanently();
      }

      // Delete notebook
      await notebook.destroyPermanently();
    });
  }

  /**
   * Search notebooks
   */
  static async searchNotebooks(query: string): Promise<Notebook[]> {
    const notebooks = await database.collections
      .get<Notebook>('notebooks')
      .query(
        Q.or(
          Q.where('title', Q.like(`%${Q.sanitizeLikeString(query)}%`)),
        ),
      )
      .fetch();

    return notebooks;
  }

  /**
   * Get recent notebooks (last accessed)
   */
  static async getRecentNotebooks(limit: number = 10): Promise<Notebook[]> {
    const notebooks = await database.collections
      .get<Notebook>('notebooks')
      .query(Q.sortBy('updated_at', Q.desc), Q.take(limit))
      .fetch();

    return notebooks;
  }
}
