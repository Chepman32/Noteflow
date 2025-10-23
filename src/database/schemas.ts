/**
 * WatermelonDB Schemas
 * Database schema for notebooks, pages, strokes, folders, and tags
 */

import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    // Notebooks table
    tableSchema({
      name: 'notebooks',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'color', type: 'string'},
        {name: 'cover_image', type: 'string', isOptional: true},
        {name: 'folder_id', type: 'string', isOptional: true, isIndexed: true},
        {name: 'is_favorite', type: 'boolean'},
        {name: 'created_at', type: 'number', isIndexed: true},
        {name: 'updated_at', type: 'number', isIndexed: true},
      ],
    }),

    // Pages table
    tableSchema({
      name: 'pages',
      columns: [
        {name: 'notebook_id', type: 'string', isIndexed: true},
        {name: 'title', type: 'string'},
        {name: 'page_number', type: 'number', isIndexed: true},
        {name: 'template_type', type: 'string'},
        {name: 'background_color', type: 'string'},
        {name: 'thumbnail', type: 'string', isOptional: true},
        {name: 'created_at', type: 'number', isIndexed: true},
        {name: 'updated_at', type: 'number', isIndexed: true},
      ],
    }),

    // Strokes table (drawing data)
    tableSchema({
      name: 'strokes',
      columns: [
        {name: 'page_id', type: 'string', isIndexed: true},
        {name: 'tool_type', type: 'string'},
        {name: 'color', type: 'string'},
        {name: 'width', type: 'number'},
        {name: 'opacity', type: 'number'},
        {name: 'points', type: 'string'}, // JSON array of points
        {name: 'layer', type: 'string'},
        {name: 'bounding_box', type: 'string'}, // JSON: {x, y, width, height}
        {name: 'created_at', type: 'number'},
      ],
    }),

    // Text elements table
    tableSchema({
      name: 'text_elements',
      columns: [
        {name: 'page_id', type: 'string', isIndexed: true},
        {name: 'content', type: 'string'},
        {name: 'x', type: 'number'},
        {name: 'y', type: 'number'},
        {name: 'width', type: 'number'},
        {name: 'height', type: 'number'},
        {name: 'font_family', type: 'string'},
        {name: 'font_size', type: 'number'},
        {name: 'color', type: 'string'},
        {name: 'bold', type: 'boolean'},
        {name: 'italic', type: 'boolean'},
        {name: 'underline', type: 'boolean'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),

    // Images table
    tableSchema({
      name: 'images',
      columns: [
        {name: 'page_id', type: 'string', isIndexed: true},
        {name: 'uri', type: 'string'},
        {name: 'x', type: 'number'},
        {name: 'y', type: 'number'},
        {name: 'width', type: 'number'},
        {name: 'height', type: 'number'},
        {name: 'rotation', type: 'number'},
        {name: 'created_at', type: 'number'},
      ],
    }),

    // Folders table (hierarchical structure)
    tableSchema({
      name: 'folders',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'color', type: 'string'},
        {name: 'parent_id', type: 'string', isOptional: true, isIndexed: true},
        {name: 'level', type: 'number'}, // 0-9 (max 10 levels)
        {name: 'created_at', type: 'number', isIndexed: true},
        {name: 'updated_at', type: 'number'},
      ],
    }),

    // Tags table
    tableSchema({
      name: 'tags',
      columns: [
        {name: 'name', type: 'string', isIndexed: true},
        {name: 'color', type: 'string'},
        {name: 'created_at', type: 'number'},
      ],
    }),

    // Notebook-Tag relationships (many-to-many)
    tableSchema({
      name: 'notebook_tags',
      columns: [
        {name: 'notebook_id', type: 'string', isIndexed: true},
        {name: 'tag_id', type: 'string', isIndexed: true},
        {name: 'created_at', type: 'number'},
      ],
    }),

    // Audio recordings table
    tableSchema({
      name: 'audio_recordings',
      columns: [
        {name: 'page_id', type: 'string', isIndexed: true},
        {name: 'uri', type: 'string'},
        {name: 'duration', type: 'number'},
        {name: 'waveform_data', type: 'string'}, // JSON array
        {name: 'created_at', type: 'number', isIndexed: true},
      ],
    }),

    // Templates table (custom user templates)
    tableSchema({
      name: 'templates',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'thumbnail', type: 'string'},
        {name: 'template_data', type: 'string'}, // JSON structure
        {name: 'is_premium', type: 'boolean'},
        {name: 'is_custom', type: 'boolean'},
        {name: 'created_at', type: 'number'},
      ],
    }),
  ],
});
