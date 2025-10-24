/**
 * Undo Manager Tests
 */

import {UndoManager, Command} from '../undo/UndoManager';

class MockCommand implements Command {
  public executeCalled = false;
  public undoCalled = false;
  public redoCalled = false;

  async execute(): Promise<void> {
    this.executeCalled = true;
  }

  async undo(): Promise<void> {
    this.undoCalled = true;
  }

  async redo(): Promise<void> {
    this.redoCalled = true;
  }
}

describe('UndoManager', () => {
  let undoManager: UndoManager;

  beforeEach(() => {
    undoManager = new UndoManager();
  });

  it('should execute command', async () => {
    const command = new MockCommand();
    await undoManager.executeCommand(command);

    expect(command.executeCalled).toBe(true);
    expect(undoManager.canUndo()).toBe(true);
  });

  it('should undo command', async () => {
    const command = new MockCommand();
    await undoManager.executeCommand(command);
    await undoManager.undo();

    expect(command.undoCalled).toBe(true);
    expect(undoManager.canUndo()).toBe(false);
    expect(undoManager.canRedo()).toBe(true);
  });

  it('should redo command', async () => {
    const command = new MockCommand();
    await undoManager.executeCommand(command);
    await undoManager.undo();
    await undoManager.redo();

    expect(command.redoCalled).toBe(true);
    expect(undoManager.canUndo()).toBe(true);
    expect(undoManager.canRedo()).toBe(false);
  });

  it('should clear redo stack on new command', async () => {
    const command1 = new MockCommand();
    const command2 = new MockCommand();

    await undoManager.executeCommand(command1);
    await undoManager.undo();

    expect(undoManager.canRedo()).toBe(true);

    await undoManager.executeCommand(command2);

    expect(undoManager.canRedo()).toBe(false);
  });

  it('should limit stack size', async () => {
    const commands: MockCommand[] = [];

    // Add 150 commands (max is 100)
    for (let i = 0; i < 150; i++) {
      const command = new MockCommand();
      commands.push(command);
      await undoManager.executeCommand(command);
    }

    expect(undoManager.getUndoCount()).toBe(100);
  });

  it('should handle empty undo', async () => {
    const result = await undoManager.undo();
    expect(result).toBe(false);
  });

  it('should handle empty redo', async () => {
    const result = await undoManager.redo();
    expect(result).toBe(false);
  });

  it('should clear history', () => {
    const command = new MockCommand();
    undoManager.executeCommand(command);

    undoManager.clear();

    expect(undoManager.canUndo()).toBe(false);
    expect(undoManager.canRedo()).toBe(false);
  });
});
