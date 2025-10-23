# NoteFlow Architecture Documentation

## Overview

NoteFlow is built using a modular, feature-based architecture that emphasizes separation of concerns, performance, and maintainability.

## Architecture Layers

### 1. Presentation Layer

The presentation layer consists of React components organized by feature:

#### Screens
- **Splash Screen**: Initial loading screen with animated logo
- **Onboarding Screen**: First-time user experience
- **Home Screen**: Main dashboard with notebook grid
- **Editor Screen**: Core drawing/note-taking interface
- **Library Screen**: Browse all notebooks and folders
- **Search Screen**: Full-text search across content
- **Settings Screen**: App configuration

#### Components
- **Common Components**: Reusable UI elements (Button, Input, Card, etc.)
- **Animation Components**: Specialized animated components
- **Gesture Components**: Gesture-driven interactive components

### 2. Business Logic Layer

#### Services
- **Drawing Engine**: Core drawing functionality using Skia
  - Stroke rendering with pressure sensitivity
  - Path smoothing with Catmull-Rom splines
  - Viewport culling for performance
  - Layer management

- **Export Service**: Convert pages to PDF/PNG/JPG
- **Search Service**: Full-text search indexing

#### State Management
- **Zustand Stores**:
  - `useSettingsStore`: Global app settings
  - `useEditorStore`: Editor state (tools, colors, zoom, etc.)

- **MMKV Storage**: Fast key-value storage for preferences

#### Hooks
- `useTheme`: Access current theme (light/dark)
- Custom hooks for feature-specific logic

### 3. Data Layer

#### WatermelonDB
High-performance reactive database built on SQLite:

**Models**:
- `Notebook`: Container for pages
- `Page`: Individual note page
- `Stroke`: Drawing stroke data
- `TextElement`: Text boxes
- `Image`: Embedded images
- `Folder`: Hierarchical organization
- `Tag`: Flexible tagging system
- `AudioRecording`: Voice notes
- `Template`: Page templates

**Schema Design**:
- Indexed columns for fast queries
- Relationships using foreign keys
- Support for complex queries and joins

#### File System
- **Media Storage**: Images, audio files stored in app directory
- **Thumbnails**: Pre-generated page thumbnails for fast loading

## Key Design Patterns

### 1. Feature-Based Organization

```
src/screens/Editor/
├── EditorScreen.tsx          # Main screen component
├── components/
│   ├── EditorCanvas.tsx      # Canvas component
│   ├── ToolPalette.tsx       # Tool selection
│   ├── PropertyBar.tsx       # Tool properties
│   └── ...
└── hooks/                    # Feature-specific hooks
```

### 2. Command Pattern (Undo/Redo)

The drawing engine uses the command pattern for undo/redo:

```typescript
interface Command {
  execute(): void;
  undo(): void;
}

class DrawStrokeCommand implements Command {
  execute() { /* Add stroke */ }
  undo() { /* Remove stroke */ }
}
```

### 3. Repository Pattern

Data access is abstracted through repositories:

```typescript
class NotebookRepository {
  async getAll(): Promise<Notebook[]>
  async getById(id: string): Promise<Notebook>
  async create(data: NotebookData): Promise<Notebook>
  async update(id: string, data: Partial<NotebookData>): Promise<Notebook>
  async delete(id: string): Promise<void>
}
```

### 4. Observer Pattern (Reactive Data)

WatermelonDB provides reactive queries that automatically update UI:

```typescript
const notebooks = useDatabase()
  .collections
  .get<Notebook>('notebooks')
  .query()
  .observe();
```

## Performance Optimizations

### 1. Rendering Performance

**Viewport Culling**:
```typescript
getStrokesInViewport(x, y, width, height) {
  return strokes.filter(stroke =>
    intersects(stroke.boundingBox, viewport)
  );
}
```

**Level of Detail**:
- Simplify strokes when zoomed out
- Use fewer points for distant strokes

**Offscreen Rendering**:
- Pre-render template backgrounds
- Cache static elements

### 2. Memory Management

**Pagination**:
- Load max 5 pages in memory
- Unload pages when navigating away

**Stroke Compression**:
- Use RLE encoding for path data
- Delta encoding for points

**Object Pooling**:
- Reuse path objects
- Pool transformation matrices

### 3. Animation Performance

**UI Thread Execution**:
All animations run on UI thread via Reanimated worklets:

```typescript
const animatedStyle = useAnimatedStyle(() => {
  'worklet';
  return {
    transform: [{scale: scale.value}],
  };
});
```

**Transform-Only Animations**:
- Prefer transform and opacity (GPU-accelerated)
- Avoid layout changes during animations

## Threading Model

### JavaScript Thread
- React component rendering
- Business logic
- Database queries

### UI Thread (via Reanimated)
- All animations
- Gesture handling
- Smooth 60fps/120fps interactions

### Native Threads
- Skia rendering (GPU-accelerated)
- SQLite database operations
- File I/O

## Data Flow

### Drawing Flow
```
User Touch Input
  ↓
Gesture Handler (UI Thread)
  ↓
Drawing Engine (Worklet)
  ↓
Skia Path Generation
  ↓
GPU Rendering
  ↓
Screen
```

### Data Persistence Flow
```
User Action
  ↓
Component Handler
  ↓
Repository Method
  ↓
WatermelonDB Transaction
  ↓
SQLite Database
  ↓
Reactive Query Update
  ↓
UI Re-render
```

## Security Considerations

### Data Encryption
- Database encryption at rest (SQLCipher)
- Secure storage for sensitive settings

### Privacy
- All data stored locally
- No cloud sync (offline-first)
- No analytics tracking without consent

## Testing Strategy

### Unit Tests
- Utils functions (math, bezier calculations)
- Service classes (drawing engine, export)
- Store logic

### Integration Tests
- Database operations
- Navigation flows
- State management

### E2E Tests (Detox)
- Complete user flows
- Drawing and editing
- Notebook management

## Scalability

### Database
- Indexed queries for O(log n) performance
- Pagination for large datasets
- Lazy loading

### File Storage
- Organized directory structure
- Automatic cleanup of orphaned files
- Thumbnail generation on background thread

### Memory
- Automatic garbage collection
- Weak references for caches
- Memory warnings handling

## Future Enhancements

### Planned Features
1. Cloud sync with end-to-end encryption
2. Collaborative editing
3. Advanced handwriting recognition
4. Custom plugin system
5. Apple Watch companion app

### Technical Improvements
1. WebAssembly for compute-intensive tasks
2. ML-based gesture prediction
3. Advanced stroke simplification
4. Real-time collaboration protocol
