/**
 * Search Service
 * Full-text search across notebooks and pages
 */

import {database} from '@database';
import {Notebook, Page} from '@database/models';
import {Q} from '@nozbe/watermelondb';

export interface SearchResult {
  type: 'notebook' | 'page' | 'text';
  id: string;
  title: string;
  snippet: string;
  notebookId?: string;
  pageId?: string;
  score: number;
}

export class SearchService {
  /**
   * Search across all content
   */
  static async search(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const results: SearchResult[] = [];

    // Search notebooks
    const notebookResults = await this.searchNotebooks(query);
    results.push(...notebookResults);

    // Search pages
    const pageResults = await this.searchPages(query);
    results.push(...pageResults);

    // Search text elements
    const textResults = await this.searchTextElements(query);
    results.push(...textResults);

    // Sort by score
    results.sort((a, b) => b.score - a.score);

    return results;
  }

  /**
   * Search notebooks
   */
  private static async searchNotebooks(query: string): Promise<SearchResult[]> {
    const notebooks = await database.collections
      .get<Notebook>('notebooks')
      .query(
        Q.where('title', Q.like(`%${Q.sanitizeLikeString(query)}%`)),
      )
      .fetch();

    return notebooks.map((nb) => ({
      type: 'notebook' as const,
      id: nb.id,
      title: nb.title,
      snippet: nb.title,
      score: this.calculateScore(query, nb.title),
    }));
  }

  /**
   * Search pages
   */
  private static async searchPages(query: string): Promise<SearchResult[]> {
    const pages = await database.collections
      .get<Page>('pages')
      .query(
        Q.where('title', Q.like(`%${Q.sanitizeLikeString(query)}%`)),
      )
      .fetch();

    return pages.map((page) => ({
      type: 'page' as const,
      id: page.id,
      title: page.title,
      snippet: page.title,
      notebookId: page.notebookId,
      score: this.calculateScore(query, page.title),
    }));
  }

  /**
   * Search text elements
   */
  private static async searchTextElements(query: string): Promise<SearchResult[]> {
    const textElements = await database.collections
      .get('text_elements')
      .query(
        Q.where('content', Q.like(`%${Q.sanitizeLikeString(query)}%`)),
      )
      .fetch();

    const results: SearchResult[] = [];

    for (const text of textElements) {
      const page = await database.collections
        .get<Page>('pages')
        .find((text as any).pageId);

      const snippet = this.createSnippet((text as any).content, query);

      results.push({
        type: 'text' as const,
        id: text.id,
        title: page.title,
        snippet,
        notebookId: page.notebookId,
        pageId: page.id,
        score: this.calculateScore(query, (text as any).content),
      });
    }

    return results;
  }

  /**
   * Calculate relevance score
   */
  private static calculateScore(query: string, text: string): number {
    const lowerQuery = query.toLowerCase();
    const lowerText = text.toLowerCase();

    // Exact match
    if (lowerText === lowerQuery) return 100;

    // Starts with query
    if (lowerText.startsWith(lowerQuery)) return 90;

    // Contains query as whole word
    const words = lowerText.split(/\s+/);
    if (words.some((w) => w === lowerQuery)) return 80;

    // Contains query
    if (lowerText.includes(lowerQuery)) return 70;

    // Fuzzy match
    const distance = this.levenshteinDistance(lowerQuery, lowerText);
    return Math.max(0, 50 - distance * 5);
  }

  /**
   * Create snippet with highlighted query
   */
  private static createSnippet(text: string, query: string, maxLength: number = 150): string {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) {
      return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
    }

    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + 50);

    let snippet = text.substring(start, end);

    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    return snippet;
  }

  /**
   * Levenshtein distance for fuzzy matching
   */
  private static levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Get recent searches
   */
  static getRecentSearches(): string[] {
    // Would use MMKV to store recent searches
    return [];
  }

  /**
   * Save search query
   */
  static saveSearchQuery(query: string): void {
    // Would save to MMKV
    console.log('Saving search query:', query);
  }

  /**
   * Clear recent searches
   */
  static clearRecentSearches(): void {
    // Would clear from MMKV
  }
}
