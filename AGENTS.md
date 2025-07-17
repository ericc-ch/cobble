# Agent Onboarding Guide

## Project Overview

`cobld` is a command-line interface (CLI) tool for building context for Large Language Models (LLMs). It provides an interactive terminal UI built with Ink for navigating and making selections.

The tool features multiple modes:

- **Code Mode**: Select files from a Git repository, add an instruction, and generate a prompt.
- **Git Commit Mode**: Automatically uses staged Git changes to generate a commit message prompt.

### Key Technologies

- **UI**: React & Ink
- **Language**: TypeScript
- **State Management**: Zustand
- **Data Fetching & Caching**: TanStack React Query
- **Bundler**: tsup
- **Linting & Formatting**: ESLint, Prettier

---

## Directory Structure

- `dist/`: Bundled application output.
- `src/`: Main source code.
  - `components/`: Reusable Ink components.
  - `lib/`: Core logic, hooks, and utilities.
  - `queries/`: TanStack Query definitions for data fetching.
  - `sections/`: UI views for different application parts.
  - `stores/`: Zustand stores for global state management.
  - `app.tsx`: The main application component where sections are assembled.
  - `main.tsx`: The application entry point.
- `package.json`: Project dependencies and scripts.
- `tsup.config.ts`: Build configuration.
- `eslint.config.js`: Linting rules.

---

## Development Workflow

### Scripts

Key scripts from `package.json`:

- `dev`: Starts the development server with file watching.
- `build`: Creates a production build in the `dist/` directory.
- `lint`: Lints the codebase for errors and style issues.
- `test`: Runs tests using vitest.
- `typecheck`: Checks for TypeScript errors.

### Coding Style

The project enforces a strict coding style using ESLint. A pre-commit hook is set up with `lint-staged` to automatically lint and fix files before they are committed.

### State Management

Global application state is managed by Zustand, with stores defined in `src/stores/`.

- `useUIStore`: Manages UI state like the active mode, active section, and whether a text input is active.
- `useFormStore`: Manages form data for each mode, including selected files and instructions
