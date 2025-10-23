/**
 * Stroke Model
 */

import {Model} from '@nozbe/watermelondb';
import {field, date, relation, readonly, text} from '@nozbe/watermelondb/decorators';
import {Associations} from '@nozbe/watermelondb/Model';
import {Point} from '@utils/bezier';

export default class Stroke extends Model {
  static table = 'strokes';

  static associations: Associations = {
    pages: {type: 'belongs_to', key: 'page_id'},
  };

  @text('page_id') pageId!: string;
  @text('tool_type') toolType!: string;
  @text('color') color!: string;
  @field('width') width!: number;
  @field('opacity') opacity!: number;
  @text('points') pointsJson!: string;
  @text('layer') layer!: string;
  @text('bounding_box') boundingBoxJson!: string;
  @readonly @date('created_at') createdAt!: Date;

  @relation('pages', 'page_id') page: any;

  get points(): Point[] {
    return JSON.parse(this.pointsJson);
  }

  get boundingBox(): {x: number; y: number; width: number; height: number} {
    return JSON.parse(this.boundingBoxJson);
  }
}
