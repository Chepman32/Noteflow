/**
 * Page Model
 */

import {Model} from '@nozbe/watermelondb';
import {
  field,
  date,
  children,
  relation,
  readonly,
  text,
} from '@nozbe/watermelondb/decorators';
import {Associations} from '@nozbe/watermelondb/Model';

export default class Page extends Model {
  static table = 'pages';

  static associations: Associations = {
    notebooks: {type: 'belongs_to', key: 'notebook_id'},
    strokes: {type: 'has_many', foreignKey: 'page_id'},
    text_elements: {type: 'has_many', foreignKey: 'page_id'},
    images: {type: 'has_many', foreignKey: 'page_id'},
    audio_recordings: {type: 'has_many', foreignKey: 'page_id'},
  };

  @text('notebook_id') notebookId!: string;
  @text('title') title!: string;
  @field('page_number') pageNumber!: number;
  @text('template_type') templateType!: string;
  @text('background_color') backgroundColor!: string;
  @text('thumbnail') thumbnail?: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('notebooks', 'notebook_id') notebook: any;
  @children('strokes') strokes: any;
  @children('text_elements') textElements: any;
  @children('images') images: any;
  @children('audio_recordings') audioRecordings: any;
}
