/**
 * Search Service Tests
 */

import {SearchService} from '../search/SearchService';

// Mock database
jest.mock('@database', () => ({
  database: {
    collections: {
      get: jest.fn().mockReturnValue({
        query: jest.fn().mockReturnValue({
          fetch: jest.fn().mockResolvedValue([]),
        }),
        find: jest.fn(),
      }),
    },
  },
}));

describe('SearchService', () => {
  describe('search', () => {
    it('should return empty array for empty query', async () => {
      const results = await SearchService.search('');
      expect(results).toEqual([]);
    });

    it('should return empty array for short query', async () => {
      const results = await SearchService.search('a');
      expect(results).toEqual([]);
    });

    // Additional tests would require proper database mocking
  });

  describe('calculateScore', () => {
    it('should score exact match highest', () => {
      const score = (SearchService as any).calculateScore('test', 'test');
      expect(score).toBe(100);
    });

    it('should score starts with match high', () => {
      const score = (SearchService as any).calculateScore('test', 'testing');
      expect(score).toBe(90);
    });

    it('should score contains match medium', () => {
      const score = (SearchService as any).calculateScore('test', 'this is a test');
      expect(score).toBeGreaterThan(60);
    });

    it('should score no match low', () => {
      const score = (SearchService as any).calculateScore('test', 'completely different');
      expect(score).toBeLessThan(50);
    });
  });

  describe('createSnippet', () => {
    it('should create snippet with query', () => {
      const text = 'This is a long text with the word test in the middle of it';
      const snippet = (SearchService as any).createSnippet(text, 'test', 50);

      expect(snippet).toContain('test');
      expect(snippet.length).toBeLessThanOrEqual(60); // 50 + ellipsis
    });

    it('should add ellipsis at start', () => {
      const text = 'A very long text at the beginning and then the word test appears';
      const snippet = (SearchService as any).createSnippet(text, 'test', 50);

      expect(snippet).toMatch(/^\.\.\./);
    });

    it('should add ellipsis at end', () => {
      const text = 'The word test appears and then a very long text continues after it';
      const snippet = (SearchService as any).createSnippet(text, 'test', 50);

      expect(snippet).toMatch(/\.\.\.$/);
    });
  });

  describe('levenshteinDistance', () => {
    it('should calculate distance for identical strings', () => {
      const distance = (SearchService as any).levenshteinDistance('test', 'test');
      expect(distance).toBe(0);
    });

    it('should calculate distance for different strings', () => {
      const distance = (SearchService as any).levenshteinDistance('test', 'text');
      expect(distance).toBe(1);
    });

    it('should calculate distance for completely different strings', () => {
      const distance = (SearchService as any).levenshteinDistance('test', 'abcd');
      expect(distance).toBe(4);
    });
  });
});
