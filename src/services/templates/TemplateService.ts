/**
 * Template Service
 * Provides pre-designed page templates
 */

export enum TemplateType {
  Blank = 'blank',
  Lined = 'lined',
  Grid = 'grid',
  DottedGrid = 'dotted',
  Cornell = 'cornell',
  MusicStaff = 'music',
  Isometric = 'isometric',
  Calendar = 'calendar',
  TodoList = 'todo',
  WeeklyPlanner = 'weekly',
  MonthlyPlanner = 'monthly',
  Storyboard = 'storyboard',
  Hexagonal = 'hexagonal',
  Engineering = 'engineering',
  Custom = 'custom',
}

export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  thumbnail: string;
  isPremium: boolean;
  backgroundColor: string;
  renderPattern: (width: number, height: number) => string; // SVG or drawing commands
}

export class TemplateService {
  private static templates: Template[] = [
    {
      id: 'blank',
      name: 'Blank',
      type: TemplateType.Blank,
      thumbnail: '',
      isPremium: false,
      backgroundColor: '#FFFFFF',
      renderPattern: () => '',
    },
    {
      id: 'lined',
      name: 'Lined',
      type: TemplateType.Lined,
      thumbnail: '',
      isPremium: false,
      backgroundColor: '#FFFFFF',
      renderPattern: (width: number, height: number) => {
        const lineSpacing = 30;
        let svg = '';
        for (let y = lineSpacing; y < height; y += lineSpacing) {
          svg += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#E5E7EB" stroke-width="1"/>`;
        }
        return svg;
      },
    },
    {
      id: 'grid',
      name: 'Grid',
      type: TemplateType.Grid,
      thumbnail: '',
      isPremium: false,
      backgroundColor: '#FFFFFF',
      renderPattern: (width: number, height: number) => {
        const gridSize = 20;
        let svg = '';

        // Vertical lines
        for (let x = gridSize; x < width; x += gridSize) {
          svg += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#E5E7EB" stroke-width="1"/>`;
        }

        // Horizontal lines
        for (let y = gridSize; y < height; y += gridSize) {
          svg += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#E5E7EB" stroke-width="1"/>`;
        }

        return svg;
      },
    },
    {
      id: 'dotted',
      name: 'Dotted Grid',
      type: TemplateType.DottedGrid,
      thumbnail: '',
      isPremium: false,
      backgroundColor: '#FFFFFF',
      renderPattern: (width: number, height: number) => {
        const dotSpacing = 20;
        let svg = '';

        for (let x = dotSpacing; x < width; x += dotSpacing) {
          for (let y = dotSpacing; y < height; y += dotSpacing) {
            svg += `<circle cx="${x}" cy="${y}" r="1" fill="#9CA3AF"/>`;
          }
        }

        return svg;
      },
    },
    {
      id: 'cornell',
      name: 'Cornell Notes',
      type: TemplateType.Cornell,
      thumbnail: '',
      isPremium: true,
      backgroundColor: '#FFFFFF',
      renderPattern: (width: number, height: number) => {
        const cueWidth = width * 0.3;
        const summaryHeight = height * 0.2;

        return `
          <line x1="${cueWidth}" y1="0" x2="${cueWidth}" y2="${height - summaryHeight}" stroke="#000" stroke-width="2"/>
          <line x1="0" y1="${height - summaryHeight}" x2="${width}" y2="${height - summaryHeight}" stroke="#000" stroke-width="2"/>
        `;
      },
    },
    {
      id: 'music',
      name: 'Music Staff',
      type: TemplateType.MusicStaff,
      thumbnail: '',
      isPremium: true,
      backgroundColor: '#FFFFFF',
      renderPattern: (width: number, height: number) => {
        const staffHeight = 80;
        const lineSpacing = 15;
        let svg = '';

        for (let y = 100; y < height - 100; y += staffHeight + 40) {
          // 5 lines for each staff
          for (let i = 0; i < 5; i++) {
            const lineY = y + i * lineSpacing;
            svg += `<line x1="50" y1="${lineY}" x2="${width - 50}" y2="${lineY}" stroke="#000" stroke-width="1.5"/>`;
          }
        }

        return svg;
      },
    },
    {
      id: 'todo',
      name: 'To-Do List',
      type: TemplateType.TodoList,
      thumbnail: '',
      isPremium: false,
      backgroundColor: '#FFFFFF',
      renderPattern: (width: number, height: number) => {
        const lineSpacing = 40;
        const checkboxSize = 20;
        let svg = '';

        for (let y = 60; y < height - 40; y += lineSpacing) {
          // Checkbox
          svg += `<rect x="40" y="${y - checkboxSize / 2}" width="${checkboxSize}" height="${checkboxSize}" fill="none" stroke="#6B7280" stroke-width="2" rx="4"/>`;

          // Line
          svg += `<line x1="80" y1="${y}" x2="${width - 40}" y2="${y}" stroke="#E5E7EB" stroke-width="1"/>`;
        }

        return svg;
      },
    },
  ];

  /**
   * Get all templates
   */
  static getAllTemplates(): Template[] {
    return this.templates;
  }

  /**
   * Get free templates
   */
  static getFreeTemplates(): Template[] {
    return this.templates.filter((t) => !t.isPremium);
  }

  /**
   * Get premium templates
   */
  static getPremiumTemplates(): Template[] {
    return this.templates.filter((t) => t.isPremium);
  }

  /**
   * Get template by ID
   */
  static getTemplateById(id: string): Template | undefined {
    return this.templates.find((t) => t.id === id);
  }

  /**
   * Get template by type
   */
  static getTemplateByType(type: TemplateType): Template | undefined {
    return this.templates.find((t) => t.type === type);
  }

  /**
   * Render template pattern
   */
  static renderTemplate(
    templateId: string,
    width: number,
    height: number,
  ): string {
    const template = this.getTemplateById(templateId);
    if (!template) return '';

    return template.renderPattern(width, height);
  }
}
