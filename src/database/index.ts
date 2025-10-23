/**
 * WatermelonDB Database Configuration
 */

import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {schema} from './schemas';
import {Notebook, Page, Stroke} from './models';

// Create adapter
const adapter = new SQLiteAdapter({
  schema,
  dbName: 'noteflow',
  jsi: true, // JSI for better performance
  onSetUpError: (error) => {
    console.error('Database setup error:', error);
  },
});

// Create database
export const database = new Database({
  adapter,
  modelClasses: [Notebook, Page, Stroke],
});
