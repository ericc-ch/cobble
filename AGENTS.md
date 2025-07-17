# Agent Onboarding Guide

`cobld` is a CLI tool for building context for LLMs with an interactive terminal UI using React & Ink.

## Commands

- **Build**: `bun run build` (production), `bun run dev` (development with watch)
- **Lint**: `bun run lint` (with cache), `bun run lint --fix` (auto-fix)
- **Test**: `bun run test` (vitest), `vitest run test/specific.test.ts` (single test)
- **Typecheck**: `bun run typecheck` (TypeScript validation)

## Code Style

- **ESLint Config**: Uses `@echristian/eslint-config` with React, React Hooks, and Prettier
- **Imports**: Use `~/` for src/ imports (e.g., `import { useUIStore } from "~/stores/ui"`)
- **TypeScript**: Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`
- **Formatting**: Prettier with packagejson plugin, auto-fixed via pre-commit hooks
- **Components**: React functional components with TypeScript interfaces
- **State**: Zustand stores in `src/stores/` with typed interfaces
- **Queries**: TanStack React Query for data fetching in `src/queries/`
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Error Handling**: Use proper TypeScript error types and optional chaining
