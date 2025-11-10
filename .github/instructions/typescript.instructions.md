---
description: 'Guidelines for TypeScript Development targeting TypeScript 5.x and ES2022 output'
applyTo: '**/*.ts'
---

# TypeScript Development

> These instructions assume projects are built with TypeScript 5.x (or newer) compiling to an ES2022 JavaScript baseline. Adjust guidance if your runtime requires older language targets or down-level transpilation.

## Core Intent

- Respect the existing architecture and coding standards.
- Prefer readable, explicit solutions over clever shortcuts.
- Extend current abstractions before inventing new ones.
- Prioritize maintainability and clarity, short methods and classes, clean code.

## General Guardrails

- Target TypeScript 5.x / ES2022 and prefer native features over polyfills.
- Use pure ES modules; never emit `require`, `module.exports`, or CommonJS helpers.
- Rely on the project's build, lint, and test scripts unless asked otherwise.
- Note design trade-offs when intent is not obvious.

## Project Organization

- Follow the repository's folder and responsibility layout for new code.
- Use kebab-case filenames (e.g., `user-session.ts`, `data-service.ts`) unless told otherwise.
- Keep tests, types, and helpers near their implementation when it aids discovery.
- Reuse or extend shared utilities before adding new ones.

## Naming & Style

- Use PascalCase for classes, interfaces, enums, and type aliases; camelCase for everything else.
- Skip interface prefixes like `I`; rely on descriptive names.
- Name things for their behavior or domain meaning, not implementation.

## Formatting & Style

- Run the repository's lint/format scripts (e.g., `npm run lint`) before submitting.
- Match the project's indentation, quote style, and trailing comma rules.
- Keep functions focused; extract helpers when logic branches grow.
- Favor immutable data and pure functions when practical.

## Type System Expectations

- Avoid `any` (implicit or explicit); prefer `unknown` plus narrowing.
- Use discriminated unions for realtime events and state machines.
- Centralize shared contracts instead of duplicating shapes.
- Express intent with TypeScript utility types (e.g., `Readonly`, `Partial`, `Record`).

## Async, Events & Error Handling

- Use `async/await`; wrap awaits in try/catch with structured errors.
- Guard edge cases early to avoid deep nesting.
- Send errors through the project's logging/telemetry utilities.
- Surface user-facing errors via the repository's notification pattern.
- Debounce configuration-driven updates and dispose resources deterministically.

## Architecture & Patterns

- Follow the repository's dependency injection or composition pattern; keep modules single-purpose.
- Observe existing initialization and disposal sequences when wiring into lifecycles.
- Keep transport, domain, and presentation layers decoupled with clear interfaces.
- Supply lifecycle hooks (e.g., `initialize`, `dispose`) and targeted tests when adding services.

## External Integrations

- Instantiate clients outside hot paths and inject them for testability.
- Apply retries, backoff, and cancellation to network or IO calls.
- Normalize external responses and map errors to domain shapes.

## Security Practices

**TypeScript-Specific Security Notes**:

- Use type guards and schema validators (Zod, io-ts) for runtime validation at API boundaries
- Leverage TypeScript's type system to enforce security constraints at compile time
- Never use `any` type for user input; prefer `unknown` with proper narrowing

## Configuration & Secrets

- Reach configuration through shared helpers and validate with schemas or dedicated validators.
- Handle secrets via the project's secure storage; guard `undefined` and error states.
- Document new configuration keys and update related tests.

## UI & UX Components

- Sanitize user or external content before rendering.
- Keep UI layers thin; push heavy logic to services or state managers.
- Use messaging or events to decouple UI from business logic.

## Testing Expectations

**TypeScript-Specific Testing Notes**:

- Use the project's testing framework (Jest, Vitest, etc.) and match existing naming conventions
- Leverage TypeScript's type system in tests - avoid `any`, use proper type assertions
- Use type-safe mocking libraries that preserve TypeScript types
- For Playwright E2E tests, see #file:playwright-typescript.instructions.md
- Prefer fake timers (`jest.useFakeTimers()`) over `setTimeout` in tests for time-dependent code

## Performance & Reliability

**TypeScript-Specific Performance Notes**:

- Lazy-load heavy dependencies and dispose them when done
- Use TypeScript's type narrowing to avoid runtime type checks
- Prefer `const` enum for eliminated runtime overhead (when appropriate)
- Avoid excessive use of decorators and reflection (significant runtime cost)
- Use `as const` for literal types to enable better tree-shaking
- Track resource lifetimes to prevent memory leaks (event listeners, timers, subscriptions)

## Documentation & Comments

- Add JSDoc to public APIs; include `@remarks` or `@example` when helpful.
- Write comments that capture intent, and remove stale notes during refactors.
- Update architecture or design docs when introducing significant patterns.
