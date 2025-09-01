# Contributing to Markdown Reader

Thank you for your interest in contributing to Markdown Reader! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/markdown-reader.git
   cd markdown-reader
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Making Changes

### Code Style

- Use 2 spaces for indentation
- Follow Vue.js style guide
- Use meaningful variable and function names
- Add comments for complex logic

### File Structure

```
src/
├── components/          # Vue components
├── router/             # Vue Router configuration
├── App.vue            # Root component
├── main.js            # Application entry point
└── style.css          # Global styles
```

### Testing

Before submitting a pull request, please:

1. Run the test suite:
   ```bash
   npm run test-all
   ```

2. Test in different environments:
   ```bash
   npm run build
   npm run preview
   ```

3. Check for linting errors and fix them

## Submitting Changes

### Pull Request Process

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

3. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub

### Commit Message Format

Use the following format for commit messages:

```
type: description

- feat: new feature
- fix: bug fix
- docs: documentation changes
- style: formatting changes
- refactor: code refactoring
- test: adding tests
- chore: maintenance tasks
```

### Pull Request Guidelines

- Provide a clear description of your changes
- Reference any related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

## Reporting Issues

When reporting issues, please include:

- Description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser and version
- Screenshots if applicable

## Feature Requests

For feature requests, please:

- Describe the feature clearly
- Explain why it would be useful
- Provide examples if possible
- Consider implementation complexity

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to create a welcoming environment for all contributors.

## Questions?

If you have questions, feel free to:

- Open an issue for discussion
- Contact the maintainers
- Join our community discussions

Thank you for contributing to Markdown Reader!
