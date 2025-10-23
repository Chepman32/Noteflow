# NoteFlow Feature Documentation

## Core Features

### 1. Advanced Drawing Engine

#### Pen Tools
- **Ballpoint Pen**: Smooth, consistent lines with moderate pressure response
  - Width: 0.5pt to 8pt
  - Pressure response: 50%
  - Default color: Blue (#2E5BFF)

- **Fountain Pen**: Elegant, variable width with high pressure response
  - Width: 1pt to 12pt
  - Pressure response: 70%
  - Tilt support for Apple Pencil
  - Default color: Black

- **Marker**: Bold, flat-tipped with low pressure response
  - Width: 2pt to 20pt
  - Pressure response: 20%
  - Square caps for authentic marker feel

- **Highlighter**: Wide, semi-transparent, sits behind text
  - Width: 8pt to 40pt
  - Opacity: 30% default (adjustable 20-60%)
  - Multiply blend mode
  - Auto-placed on background layer

- **Pencil**: Textured with very high pressure response
  - Width: 0.5pt to 6pt
  - Pressure response: 80%
  - Grainy texture simulation
  - Graphite gray color

#### Stroke Smoothing
- Catmull-Rom spline smoothing
- Adjustable tension (0.0 to 1.0)
- Point decimation removes points < 1pt apart
- Velocity-based width variation

#### Palm Rejection
- ML-based touch classification
- Heuristic fallback for compatibility
- User-adjustable sensitivity (Low/Medium/High)
- Input features:
  - Touch area size
  - Touch shape (aspect ratio)
  - Distance from last pen input
  - Time since last pen input

### 2. Gesture System

#### Drawing Gestures
- **Single Touch**: Draw with active tool
- **Apple Pencil Double-Tap**: Switch between pen and eraser

#### Navigation Gestures
- **Two-Finger Swipe**: Navigate between pages
- **Edge Swipe**: Go back or open drawer
- **Pull-to-Refresh**: Refresh content

#### Canvas Manipulation
- **Pinch**: Zoom in/out (0.5x to 4.0x)
- **Two-Finger Pan**: Move canvas
- **Two-Finger Rotate**: Rotate canvas (snaps to 0°, 90°, 180°, 270°)
- **Double-Tap Reset**: Return to default view

#### Advanced Gestures
- **Long Press**: Select element, show context menu
- **Swipe on List Item**: Reveal actions (favorite, delete, share)
- **Three-Finger Swipe**: Undo/redo

### 3. Organization System

#### Notebooks
- Unlimited notebooks (5GB limit in free tier)
- Custom covers and colors
- Page count tracking
- Last modified timestamp
- Favorite notebooks

#### Folders
- Hierarchical structure (up to 10 levels)
- Drag-and-drop organization
- Color coding
- Nested folders support

#### Tags
- Flexible tagging system
- Color-coded tags
- Filter by multiple tags
- Tag auto-suggestions

#### Smart Collections
- Recent items (last 50 accessed)
- Favorites
- Custom filters by:
  - Date range
  - Content type
  - Tags
  - Notebooks

### 4. Templates

#### Pre-Designed Templates (50+)
- **Blank**: Clean white page
- **Ruled**: Horizontal lines
- **Grid**: Square or rectangular grid
- **Dotted**: Dot grid
- **Cornell Notes**: Two-column layout
- **Music Staff**: Musical notation
- **Isometric**: 3D drawing grid
- **Calendar**: Monthly/weekly layouts
- **To-Do Lists**: Checkbox templates
- **Planners**: Daily/weekly planners
- **Storyboards**: Frame layouts
- **Custom**: User-created templates

#### Template Editor (Premium)
- Create custom templates
- Save as reusable templates
- Share with other users
- Template marketplace

### 5. Search

#### Full-Text Search
- Search across all notebooks
- Search in page titles
- Search in text elements
- Filter by date, notebook, tags

#### Handwriting Recognition (Premium)
- OCR for handwritten text
- Search handwritten content
- Convert handwriting to text
- Multiple language support

#### Advanced Filters
- Content type (drawings, text, images)
- Date range
- Notebook location
- Tag combinations

### 6. Export & Sharing

#### Export Formats
- **PDF**: Vector-based, scalable
- **PNG**: Raster image with transparency
- **JPG**: Compressed image
- **NoteFlow Format**: Editable proprietary format

#### Export Options
- Single page
- Page range
- Entire notebook
- Batch export

#### Sharing
- iOS Share Sheet integration
- Email attachment
- AirDrop
- Save to Files
- Print

### 7. Media Integration

#### Images
- Insert from photo library
- Capture with camera
- Crop and rotate
- Filters and adjustments
- Resize and position

#### Audio
- Record voice notes
- Waveform visualization
- Sync with page timestamps
- Playback controls

#### Stickers (Premium)
- 500+ vector stickers
- 20+ categories
- Resize and rotate
- Custom stickers

### 8. Themes

#### Light Theme
- Pure white background
- Deep blue primary color
- Warm coral secondary
- Vibrant teal accent

#### Dark Theme
- True black background (OLED optimized)
- Adjusted colors for dark mode
- Reduced eye strain
- Preserves battery on OLED screens

#### Auto Theme
- Follows system setting
- Smooth transition between modes

### 9. Animations

#### Screen Transitions
- Push/pop navigation with physics
- Modal presentation with blur
- Bottom sheet with snap points
- Page curl effect

#### Micro-Animations
- Button press feedback
- List item stagger
- Card lift on press
- Tool selection bounce

#### Loading States
- Skeleton screens
- Progress indicators
- Shimmer effects

### 10. Accessibility

#### VoiceOver Support
- All UI elements labeled
- Meaningful descriptions
- Logical navigation order

#### Dynamic Type
- Respects system text size
- Scales appropriately
- Maintains readability

#### Reduced Motion
- Respects system preference
- Simplified animations
- No particle effects

## Premium Features

### Included in Premium Subscription

1. **Unlimited Storage**: Beyond 5GB limit
2. **All Pen Types**: Access to all 5 pen tools
3. **Full Color Palette**: 300+ colors
4. **Premium Templates**: 50+ exclusive templates
5. **Template Editor**: Create custom templates
6. **Complete Sticker Library**: 500+ stickers
7. **Handwriting Recognition**: OCR for handwritten text
8. **All Export Formats**: PDF, PNG, JPG, proprietary
9. **Custom Themes**: Create custom color schemes
10. **Audio Recording**: Unlimited length recordings
11. **Advanced Shape Recognition**: All shapes supported
12. **Priority Support**: Faster response times

### Free Tier Limitations

1. **Storage**: 5GB limit
2. **Pen Tools**: 3 basic types
3. **Colors**: 20 basic colors
4. **Templates**: 20 essential templates
5. **Stickers**: 200 basic stickers
6. **Export**: PDF only
7. **Themes**: 3 standard themes
8. **Audio**: Basic recording (5 min max)

## Performance Features

### Optimizations
- **Viewport Culling**: Only render visible strokes
- **LOD System**: Simplify distant strokes
- **Lazy Loading**: Load pages on-demand
- **Thumbnail Caching**: Fast preview generation
- **Frame Rate**: Target 120fps on ProMotion
- **Memory Management**: Aggressive cleanup

### Offline First
- All features work offline
- No internet required
- Local-only data storage
- Fast, instant access

## Future Features (Roadmap)

### Phase 2
- Cloud sync with encryption
- Collaborative editing
- Version history
- Page linking and backlinks

### Phase 3
- AI-powered features
- Smart suggestions
- Auto-categorization
- Advanced OCR

### Phase 4
- Apple Watch companion
- Widget support
- Shortcuts integration
- AR features
