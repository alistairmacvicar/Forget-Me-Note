---
applyTo: '**/*.{vue,jsx,tsx,html,css,scss,sass,less}'
description: 'Frontend performance optimization: rendering, DOM, assets, network, JavaScript, and framework-specific patterns for React, Angular, and Vue'
---

# Frontend Performance Optimization

## Core Principles

- **Measure First, Optimize Second:** Use Chrome DevTools, Lighthouse, and profilers to identify real bottlenecks
- **Optimize for the Common Case:** Focus on frequently executed code paths
- **Avoid Premature Optimization:** Write clear code first; optimize when necessary
- **Monitor Core Web Vitals:** Track LCP (Largest Contentful Paint), FID (First Input Delay), CLS (Cumulative Layout Shift)
- **Set Performance Budgets:** Define limits for bundle size, load time, and enforce them

## Rendering and DOM

### DOM Manipulation

- **Minimize DOM Manipulations:** Batch updates where possible. Frequent DOM changes are expensive
  - _Anti-pattern:_ Updating the DOM in a loop. Instead, build a document fragment and append it once
- **Virtual DOM Frameworks:** Use React, Vue, or similar efficiently—avoid unnecessary re-renders
- **Keys in Lists:** Always use stable keys in lists to help virtual DOM diffing. Avoid array indices as keys unless the list is static
- **Avoid Inline Styles:** Inline styles can trigger layout thrashing. Prefer CSS classes
- **CSS Animations:** Use CSS transitions/animations over JavaScript for smoother, GPU-accelerated effects
- **Defer Non-Critical Rendering:** Use `requestIdleCallback` or similar to defer work until the browser is idle

### Layout and Paint

- **Avoid Layout Thrashing:** Read layout properties (offsetHeight, getBoundingClientRect) separately from writes
- **Use CSS Containment:** Apply `contain: layout` or `contain: paint` to isolate expensive layout calculations
- **Reduce Reflows:** Minimize changes that trigger reflows (width, height, margin, padding, border)
- **Hardware Acceleration:** Use `transform` and `opacity` for animations (they trigger compositing, not layout/paint)

## Asset Optimization

### Images

- **Image Compression:** Use tools like ImageOptim, Squoosh, or TinyPNG
- **Modern Formats:** Prefer WebP or AVIF for web delivery (with fallbacks)
- **Responsive Images:** Use `srcset` and `sizes` attributes for different screen sizes
- **Lazy Loading:** Use `loading="lazy"` for images below the fold
- **SVGs for Icons:** SVGs scale well and are often smaller than PNGs for simple graphics
- **Image CDN:** Use services like Cloudinary or imgix for on-the-fly optimization

### Bundling and Code

- **Minification:** Use Webpack, Rollup, Vite, or esbuild to bundle and minify JS/CSS
- **Tree-Shaking:** Enable to remove dead code from bundles
- **Code Splitting:** Split code by route or component for smaller initial bundles
- **Dynamic Imports:** Use `import()` for lazy-loading modules
- **Bundle Analysis:** Use webpack-bundle-analyzer to identify large dependencies

### Fonts

- **Font Subsetting:** Include only the characters you need
- **Font Display:** Use `font-display: swap` to avoid invisible text during loading
- **Preload Critical Fonts:** Use `<link rel="preload" as="font">` for above-the-fold fonts
- **Variable Fonts:** Consider variable fonts to reduce number of font files
- **Limit Font Weights:** Only include font weights you actually use

## Network Optimization

### HTTP and Caching

- **Reduce HTTP Requests:** Combine files, use image sprites, inline critical CSS
- **HTTP/2 and HTTP/3:** Enable these protocols for multiplexing and lower latency
- **Cache Headers:** Set long-lived cache headers for static assets (1 year+)
- **Cache Busting:** Use hashed filenames for cache invalidation
- **CDNs:** Serve static assets from a CDN close to your users
- **Compression:** Enable gzip or Brotli compression for text assets

### Resource Loading

- **Defer/Async Scripts:** Use `defer` or `async` for non-critical JS to avoid blocking rendering
- **Preload Critical Resources:** Use `<link rel="preload">` for critical CSS, fonts, or JS
- **Prefetch Next-Page Resources:** Use `<link rel="prefetch">` for resources needed on next navigation
- **DNS Prefetch:** Use `<link rel="dns-prefetch">` for third-party domains
- **Inline Critical CSS:** Inline above-the-fold CSS to avoid render-blocking requests

### Progressive Enhancement

- **Service Workers:** Cache assets for offline use and faster repeat visits
- **IndexedDB:** Store application data client-side for offline functionality
- **App Shell Pattern:** Cache shell HTML/CSS/JS for instant loads

## JavaScript Performance

### Execution Optimization

- **Avoid Blocking the Main Thread:** Offload heavy computation to Web Workers
- **Debounce/Throttle Events:** For scroll, resize, and input events, limit handler frequency
- **Use RequestAnimationFrame:** For animations and visual updates synchronized with the browser's repaint cycle
- **Avoid Long Tasks:** Break up long-running scripts into smaller chunks with `setTimeout` or `requestIdleCallback`

### Memory Management

- **Clean Up Event Listeners:** Always remove event listeners when elements are removed from DOM
- **Clear Intervals and Timeouts:** Track and clear all intervals/timeouts when components unmount
- **Avoid Global Variables:** Minimize global scope pollution
- **WeakMap for Caching:** Use WeakMap when caching objects to allow garbage collection
- **Profile Memory:** Use Chrome DevTools Memory Profiler to find leaks

### Data Structures

- **Use Maps/Sets:** For lookups and unique collections (faster than objects/arrays for large datasets)
- **TypedArrays:** For numeric data processing (much faster than regular arrays)
- **Avoid Deep Cloning:** Use shallow copies when possible; libraries like lodash's `cloneDeep` only when necessary
- **Immutable Updates:** Use spread operators or Object.assign for shallow updates

## Framework-Specific Optimization

### React

**Re-Render Prevention:**

- Use `React.memo` for component memoization
- Use `useMemo` for expensive computations
- Use `useCallback` for function memoization
- Avoid anonymous functions in JSX (creates new reference on every render)

**Code Splitting:**

- Use `React.lazy` and `Suspense` for lazy loading
- Split by route or large component

**Profiling:**

- Use React DevTools Profiler to identify slow components
- Enable Strict Mode to catch potential issues

**Best Practices:**

- Use `ErrorBoundary` to catch and handle errors gracefully
- Keep component state minimal
- Lift state up sparingly (prefer composition)

### Vue

**Reactivity Optimization:**

- Use computed properties over methods in templates for caching
- Use `v-show` vs `v-if` appropriately (`v-show` for frequent toggles)
- Use `v-once` for static content that doesn't change
- Use `v-memo` (Vue 3.2+) for expensive list items

**Code Splitting:**

- Lazy load components with `defineAsyncComponent`
- Lazy load routes with Vue Router

**Profiling:**

- Use Vue Devtools Performance tab
- Enable performance tracing in development

**Best Practices:**

- Keep components small and focused
- Use `shallowRef` and `shallowReactive` when deep reactivity isn't needed

### Angular

**Change Detection:**

- Use OnPush change detection strategy for components that don't need frequent updates
- Avoid complex expressions in templates; move logic to component class
- Use `trackBy` in `*ngFor` for efficient list rendering
- Detach change detection for heavy computations

**Code Splitting:**

- Lazy load modules with Angular Router
- Use standalone components (Angular 14+) for more granular lazy loading

**Profiling:**

- Use Angular DevTools for performance profiling
- Use `ng build --stats-json` with webpack-bundle-analyzer

**Best Practices:**

- Unsubscribe from Observables in ngOnDestroy
- Use `async` pipe to auto-unsubscribe
- Avoid function calls in templates

## Accessibility and Performance

- **Semantic HTML:** Use appropriate HTML5 elements (improves both accessibility and performance)
- **ARIA Updates:** Ensure ARIA live regions aren't updated excessively
- **Screen Reader Performance:** Avoid rapid DOM updates that overwhelm assistive technology
- **Focus Management:** Efficiently manage focus for keyboard navigation

## Common Frontend Pitfalls

- Loading large JS bundles on initial page load
- Not compressing images or using outdated formats
- Failing to clean up event listeners, causing memory leaks
- Overusing third-party libraries for simple tasks
- Ignoring mobile performance (always test on real devices!)
- Blocking the main thread with heavy JavaScript
- Not using code splitting for large applications

## Troubleshooting

### Tools

- **Chrome DevTools Performance Tab:** Record and analyze slow frames, identify bottlenecks
- **Lighthouse:** Automated audits with actionable suggestions
- **WebPageTest:** Real-world load testing from multiple locations
- **Core Web Vitals:** Monitor LCP, FID, CLS in production

### Debugging Techniques

- **Performance Timeline:** Record interactions and identify slow operations
- **Frame Profiler:** Find dropped frames and jank
- **Memory Profiler:** Identify memory leaks and excessive allocations
- **Network Waterfall:** Identify blocking resources and slow requests

## Practical Examples

### Debouncing User Input

```javascript
// BAD: Triggers API call on every keystroke
input.addEventListener('input', (e) => {
	fetch(`/search?q=${e.target.value}`);
});

// GOOD: Debounce API calls
let timeout;
input.addEventListener('input', (e) => {
	clearTimeout(timeout);
	timeout = setTimeout(() => {
		fetch(`/search?q=${e.target.value}`);
	}, 300);
});
```

### Lazy Loading Images

```html
<!-- BAD: Loads all images immediately -->
<img
	src="large-image.jpg"
	alt="Description"
/>

<!-- GOOD: Lazy loads images -->
<img
	src="large-image.jpg"
	alt="Description"
	loading="lazy"
/>

<!-- BETTER: Responsive + lazy loading -->
<img
	srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w"
	sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
	src="large.jpg"
	alt="Description"
	loading="lazy"
/>
```

### Efficient List Rendering (React)

```jsx
// BAD: No memoization, no stable keys
function UserList({ users }) {
	return users.map((user, index) => (
		<UserCard
			key={index}
			user={user}
			onDelete={() => deleteUser(user.id)}
		/>
	));
}

// GOOD: Memoization, stable keys, memoized callbacks
const UserCard = React.memo(({ user, onDelete }) => (
	<div>
		{user.name} <button onClick={onDelete}>Delete</button>
	</div>
));

function UserList({ users }) {
	const deleteUser = useCallback((id) => {
		// delete logic
	}, []);

	return users.map((user) => (
		<UserCard
			key={user.id}
			user={user}
			onDelete={() => deleteUser(user.id)}
		/>
	));
}
```

## Performance Budget Example

Set and enforce limits:

- **JavaScript Bundle:** Max 200KB (gzipped) for initial load
- **Images:** Max 150KB per page
- **LCP:** < 2.5 seconds
- **FID:** < 100 milliseconds
- **CLS:** < 0.1
- **Total Page Weight:** < 1MB

## References

- [Google Web Fundamentals: Performance](https://web.dev/performance/)
- [MDN Web Docs: Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vue Performance](https://vuejs.org/guide/best-practices/performance.html)
- [Angular Performance](https://angular.io/guide/performance-best-practices)

## Summary

Frontend performance is about delivering fast, smooth user experiences. Focus on:

- Minimizing and optimizing assets (images, JS, CSS)
- Efficient DOM manipulation and rendering
- Smart resource loading (lazy, async, preload)
- Framework-specific optimizations
- Continuous monitoring and measurement

Always measure first, optimize second, and test on real devices!
