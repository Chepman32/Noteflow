# Contributing to NoteFlow

Thank you for your interest in contributing to NoteFlow! This document provides guidelines for contributing to the project.

## Development Setup

### Prerequisites
- Node.js >= 18
- Xcode 14+ (for iOS)
- CocoaPods
- Git

### Setup Steps
1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Install iOS dependencies: `cd ios && pod install && cd ..`
4. Run the app: `npm run ios`

## Code Style

### TypeScript
- Use TypeScript for all new code
- Enable strict mode
- Provide type annotations for function parameters and return values
- Use interfaces over types when possible

### React
- Use functional components with hooks
- Follow React best practices
- Use React.FC for component types
- Implement proper prop types

### Naming Conventions
- Components: PascalCase (e.g., `EditorCanvas.tsx`)
- Functions: camelCase (e.g., `handlePress`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_ZOOM_LEVEL`)
- Files: PascalCase for components, camelCase for utilities

### File Organization
```
src/
├── components/     # Reusable components
├── screens/        # Screen components
├── services/       # Business logic
├── store/          # State management
├── utils/          # Utility functions
└── ...
```

## Testing

### Unit Tests
```bash
npm test
```

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

## Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, documented code
   - Add tests for new features
   - Update documentation as needed

3. **Commit**
   - Use conventional commits format
   - Examples:
     - `feat: add shape recognition`
     - `fix: resolve drawing lag issue`
     - `docs: update API documentation`

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **PR Requirements**
   - Clear description of changes
   - Link to related issues
   - Screenshots/videos for UI changes
   - All tests passing
   - No linting errors

## Feature Requests

1. Open an issue with the `enhancement` label
2. Describe the feature and use case
3. Provide mockups or examples if applicable
4. Wait for discussion and approval before implementing

## Bug Reports

1. Search existing issues first
2. Provide clear reproduction steps
3. Include:
   - Device/OS version
   - App version
   - Screenshots/videos
   - Error messages
   - Expected vs actual behavior

## Code Review

- All PRs require code review
- Address review comments promptly
- Be respectful and constructive
- Focus on code quality and maintainability

## Performance Guidelines

- Run animations on UI thread (Reanimated worklets)
- Minimize bridge crossing
- Use memoization where appropriate
- Profile performance-critical code
- Target 60fps minimum (120fps on ProMotion)

## Documentation

- Document complex functions
- Update README for feature changes
- Keep ARCHITECTURE.md in sync
- Add JSDoc comments for public APIs

## Questions?

Feel free to open an issue for questions or clarifications.

Thank you for contributing to NoteFlow!
