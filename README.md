# NoteFlow

A gesture-driven digital note-taking application for iOS, built with React Native.

## Overview

NoteFlow is a premium note-taking application that combines the fluidity of handwriting with the power of digital organization. It features physics-based animations, sophisticated gesture controls, and a completely offline-first architecture.

## Key Features

- **Gesture-First Interface**: Intuitive gesture controls for natural interaction
- **Advanced Drawing Engine**: GPU-accelerated rendering with pressure sensitivity and palm rejection
- **Physics-Based Animations**: Smooth, natural animations using Reanimated 3 and Skia
- **Complete Offline Functionality**: All features work without internet connectivity
- **Organization System**: Notebooks, folders, tags, and powerful search
- **Multiple Drawing Tools**: Ballpoint, fountain pen, marker, highlighter, and pencil
- **Templates**: 50+ pre-designed templates for various use cases
- **Export Options**: PDF, PNG, and JPG export formats

## Tech Stack

- **Framework**: React Native 0.74+
- **Language**: TypeScript 5+
- **Animations**: React Native Reanimated 3, React Native Skia
- **Gestures**: React Native Gesture Handler
- **Database**: WatermelonDB (SQLite)
- **State Management**: Zustand
- **Storage**: React Native MMKV
- **Navigation**: React Navigation

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── common/      # Common components (Button, Input, Card, etc.)
│   ├── animations/  # Animated components
│   └── gestures/    # Gesture-driven components
├── screens/         # Screen components
│   ├── Home/        # Home screen with notebook grid
│   ├── Editor/      # Drawing editor screen
│   ├── Library/     # Library/navigator screen
│   ├── Search/      # Search screen
│   └── Settings/    # Settings screen
├── navigation/      # Navigation configuration
├── services/        # Business logic services
│   ├── drawing/     # Drawing engine
│   ├── export/      # Export functionality
│   └── search/      # Search and indexing
├── store/           # Zustand stores
├── database/        # WatermelonDB models and schemas
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── constants/       # App constants
├── theme/           # Design tokens and theme
└── assets/          # Images, fonts, animations
```

## Installation

### Prerequisites

- Node.js >= 18
- Xcode 14+ (for iOS development)
- CocoaPods

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd NoteFlow
```

2. Install dependencies:
```bash
npm install
```

3. Install iOS dependencies:
```bash
cd ios && pod install && cd ..
```

4. Run the app:
```bash
npm run ios
```

## Development

### Available Scripts

- `npm run ios` - Run on iOS simulator
- `npm start` - Start Metro bundler
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Design System

The app uses a comprehensive design system based on the software design document:

- **Colors**: Light and dark themes with OLED optimization
- **Typography**: SF Pro font family with predefined type scales
- **Spacing**: 4pt base grid system
- **Components**: Reusable UI components with consistent styling

### Animation System

All animations use Reanimated 3 worklets for 60fps/120fps performance:

- **Spring Configurations**: Predefined spring configs for different animation types
- **Gesture Integration**: Seamless integration with gesture handlers
- **UI Thread Execution**: All animations run on the UI thread

## Architecture

### Drawing Engine

The drawing engine is built on React Native Skia for GPU-accelerated rendering:

- Stroke smoothing using Catmull-Rom splines
- Pressure sensitivity support for Apple Pencil
- Viewport culling for performance
- Layer system for organizing strokes

### Database

WatermelonDB provides high-performance reactive data access:

- SQLite backend with JSI for better performance
- Lazy loading and pagination
- Indexed queries for fast search
- Offline-first architecture

### State Management

- **Zustand**: Global app state (settings, editor state)
- **MMKV**: Persistent key-value storage for preferences
- **WatermelonDB**: Reactive database queries

## Performance Optimization

- **Viewport Culling**: Only render visible strokes
- **Level of Detail**: Simplify strokes when zoomed out
- **Offscreen Rendering**: Pre-render static content
- **Memory Management**: Aggressive cleanup and object pooling
- **Frame Budget**: Target 120fps on ProMotion displays

## Testing

### Unit Tests

```bash
npm test
```

### E2E Tests

```bash
npm run test:e2e
```

## Building for Production

### iOS

1. Open `ios/NoteFlow.xcworkspace` in Xcode
2. Select your signing team
3. Archive and upload to App Store

## License

Proprietary - All rights reserved

## Author

Built with Claude Code

## Version

1.0.0
