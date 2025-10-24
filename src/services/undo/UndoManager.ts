/**
 * Undo/Redo Manager
 * Command pattern implementation for undo/redo functionality
 */

export interface Command {
  execute(): void | Promise<void>;
  undo(): void | Promise<void>;
  redo?(): void | Promise<void>;
}

export class UndoManager {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  private maxStackSize: number = 100;

  /**
   * Execute a command and add to undo stack
   */
  async executeCommand(command: Command): Promise<void> {
    await command.execute();
    this.undoStack.push(command);

    // Clear redo stack when new command is executed
    this.redoStack = [];

    // Limit stack size
    if (this.undoStack.length > this.maxStackSize) {
      this.undoStack.shift();
    }
  }

  /**
   * Undo last command
   */
  async undo(): Promise<boolean> {
    const command = this.undoStack.pop();
    if (!command) return false;

    await command.undo();
    this.redoStack.push(command);

    return true;
  }

  /**
   * Redo last undone command
   */
  async redo(): Promise<boolean> {
    const command = this.redoStack.pop();
    if (!command) return false;

    if (command.redo) {
      await command.redo();
    } else {
      await command.execute();
    }

    this.undoStack.push(command);

    return true;
  }

  /**
   * Check if can undo
   */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Check if can redo
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Get undo stack size
   */
  getUndoCount(): number {
    return this.undoStack.length;
  }

  /**
   * Get redo stack size
   */
  getRedoCount(): number {
    return this.redoStack.length;
  }
}

/**
 * Draw Stroke Command
 */
export class DrawStrokeCommand implements Command {
  constructor(
    private strokeId: string,
    private drawingEngine: any,
    private strokeData: any,
  ) {}

  async execute(): Promise<void> {
    // Stroke already drawn during gesture, just record it
  }

  async undo(): Promise<void> {
    this.drawingEngine.removeStroke(this.strokeId);
  }

  async redo(): Promise<void> {
    this.drawingEngine.addStroke(this.strokeId, this.strokeData);
  }
}

/**
 * Erase Stroke Command
 */
export class EraseStrokeCommand implements Command {
  constructor(
    private strokeId: string,
    private drawingEngine: any,
    private strokeData: any,
  ) {}

  async execute(): Promise<void> {
    this.drawingEngine.removeStroke(this.strokeId);
  }

  async undo(): Promise<void> {
    this.drawingEngine.addStroke(this.strokeId, this.strokeData);
  }

  async redo(): Promise<void> {
    this.drawingEngine.removeStroke(this.strokeId);
  }
}

/**
 * Add Text Command
 */
export class AddTextCommand implements Command {
  constructor(
    private textId: string,
    private textData: any,
    private pageManager: any,
  ) {}

  async execute(): Promise<void> {
    await this.pageManager.addText(this.textId, this.textData);
  }

  async undo(): Promise<void> {
    await this.pageManager.removeText(this.textId);
  }

  async redo(): Promise<void> {
    await this.pageManager.addText(this.textId, this.textData);
  }
}

/**
 * Move Element Command
 */
export class MoveElementCommand implements Command {
  constructor(
    private elementId: string,
    private oldPosition: {x: number; y: number},
    private newPosition: {x: number; y: number},
    private pageManager: any,
  ) {}

  async execute(): Promise<void> {
    await this.pageManager.moveElement(this.elementId, this.newPosition);
  }

  async undo(): Promise<void> {
    await this.pageManager.moveElement(this.elementId, this.oldPosition);
  }

  async redo(): Promise<void> {
    await this.pageManager.moveElement(this.elementId, this.newPosition);
  }
}

/**
 * Batch Command - execute multiple commands as one
 */
export class BatchCommand implements Command {
  constructor(private commands: Command[]) {}

  async execute(): Promise<void> {
    for (const command of this.commands) {
      await command.execute();
    }
  }

  async undo(): Promise<void> {
    // Undo in reverse order
    for (let i = this.commands.length - 1; i >= 0; i--) {
      await this.commands[i].undo();
    }
  }

  async redo(): Promise<void> {
    for (const command of this.commands) {
      if (command.redo) {
        await command.redo();
      } else {
        await command.execute();
      }
    }
  }
}
