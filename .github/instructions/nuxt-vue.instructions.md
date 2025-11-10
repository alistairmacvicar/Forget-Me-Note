---
description: 'Nuxt 3 and Vue 3 development standards with Composition API, TypeScript, and Tailwind CSS'
applyTo: '**/*.vue,**/*.ts,**/*.js'
---

# Nuxt 3 & Vue 3 Development Guidelines

Instructions for building applications with Nuxt 3, Vue 3 Composition API, TypeScript, and modern best practices.

## Development Standards

### Component Architecture

- Use `<script setup lang="ts">` syntax for all new components
- Favor the Composition API over Options API
- Keep components small and focused on single responsibility
- Separate UI components (presentational) from logic components (containers)
- Extract reusable logic into composables in `composables/` directory
- Use PascalCase for component names, kebab-case for file names

### TypeScript Integration

- Use `defineProps` and `defineEmits` with proper TypeScript typing
- Leverage `PropType<T>` for complex prop types
- Define interfaces for component props, emits, and state shapes
- Use generic components where applicable for reusability
- Avoid `any` type - prefer `unknown` with type guards

### Nuxt 3 Specific Patterns

- Use Nuxt 3 auto-imports for Vue and Nuxt utilities
- Leverage `useFetch` and `useAsyncData` for data fetching
- Use `useNuxtData` for accessing cached data
- Implement `useHead` for SEO and meta tag management
- Use `navigateTo` for programmatic navigation

### State Management

- Use `useState` for simple global state in Nuxt 3
- For complex state, consider Pinia with `defineStore`
- Keep local component state with `ref` and `reactive`
- Use `computed` for derived state
- Implement proper cleanup in `onUnmounted`

### Styling with Tailwind CSS

- Use Tailwind utility classes for styling
- Apply `@apply` directive sparingly in `<style>` blocks
- Use `<style scoped>` for component-specific styles
- Implement responsive design with Tailwind's breakpoint prefixes
- Follow mobile-first responsive design principles

### Performance Optimization

- Use `defineAsyncComponent` for code splitting
- Implement lazy loading with `<LazyComponent>` prefix
- Apply `v-once` for static content
- Use `<ClientOnly>` for client-side only components
- Optimize images with `<NuxtImg>` and `<NuxtPicture>`
- Minimize bundle size with tree-shaking

### Data Fetching Patterns

- Use `useFetch` for API calls with automatic caching
- Implement proper loading and error states
- Use `useAsyncData` for custom async operations
- Apply `server: false` for client-side only data fetching
- Implement optimistic updates where appropriate
- Handle stale data with refresh strategies

### Error Handling

- Use Nuxt's built-in error handling with `throw createError()`
- Implement error boundaries with `<NuxtErrorBoundary>`
- Use `clearError()` for error recovery

### Form Handling

- Use `v-model` for two-way data binding
- Implement proper form validation
- Handle form submission with proper loading states
- Use `useFormData` for complex form handling
- Ensure accessibility with proper labeling

## Common Anti-patterns to Avoid

- Don't use Options API for new components
- Avoid direct DOM manipulation
- Avoid nested `v-for` without proper keys
- Don't mutate props directly
