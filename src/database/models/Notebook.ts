/**
 * Notebook Model
 */

import {Model, Q} from '@nozbe/watermelondb';
import {
  field,
  date,
  children,
  relation,
  readonly,
  text,
} from '@nozbe/watermelondb/decorators';
import {Associations} from '@nozbe/watermelondb/Model';

export default class Notebook extends Model {
  static table = 'notebooks';

  static associations: Associations = {
    pages: {type: 'has_many', foreignKey: 'notebook_id'},
    folders: {type: 'belongs_to', key: 'folder_id'},
    notebook_tags: {type: 'has_many', foreignKey: 'notebook_id'},
  };

  @text('title') title!: string;
  @text('color') color!: string;
  @text('cover_image') coverImage?: string;
  @text('folder_id') folderId?: string;
  @field('is_favorite') isFavorite!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('pages') pages: any;
  @relation('folders', 'folder_id') folder: any;
  @children('notebook_tags') notebookTags: any;

  async getTags() {
    const notebookTags = await this.notebookTags.fetch();
    const tags = await Promise.all(
      notebookTags.map(async (nt: any) => {
        return await nt.tag.fetch();
      }),
    );
    return tags;
  }

  async getPageCount() {
    const pages = await this.pages.fetch();
    return pages.length;
  }
}
