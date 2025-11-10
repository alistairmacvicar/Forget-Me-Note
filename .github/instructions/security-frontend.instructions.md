---
applyTo: '**/*.{vue,jsx,tsx,html,css,scss,sass,less,svelte}'
description: 'Frontend security: XSS prevention, CSP, trusted types, client-side validation, secure storage, and UI-specific OWASP guidance'
---

# Frontend Security Guidelines

## Core Principles

- **Never Trust Client-Side Data:** Validation on the frontend is for UX only; always validate on the backend
- **Encode All User-Controlled Output:** Prevent XSS by treating user data as text, not code
- **Use Security Headers:** CSP, X-Frame-Options, and other headers protect against common attacks
- **Minimize Client-Side Secrets:** Never store sensitive data in localStorage or client-side code
- **Defense in Depth:** Layer multiple security controls for comprehensive protection

## Cross-Site Scripting (XSS) Prevention

### Output Encoding

**Always encode user-controlled data before rendering:**

```javascript
// BAD: Direct HTML insertion (XSS vulnerable)
element.innerHTML = userInput;

// GOOD: Use textContent for text data
element.textContent = userInput;

// GOOD: Use a framework's safe rendering (React, Vue, Angular auto-escape)
<div>{{ userInput }}</div>; // Vue automatically escapes

// If HTML is needed, sanitize first
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

### Framework-Specific Guidance

**React:**

- Use JSX (auto-escapes by default)
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- If required, sanitize with DOMPurify first

**Vue:**

- Use `{{ }}` interpolation (auto-escapes)
- Avoid `v-html` unless absolutely necessary
- If required, sanitize with DOMPurify first

**Angular:**

- Use `{{ }}` interpolation (auto-escapes)
- Avoid `[innerHTML]` unless absolutely necessary
- Angular's sanitizer is built-in but limited; use DOMPurify for complex HTML

### URL Construction

```javascript
// BAD: User input in javascript: protocol (XSS)
const link = `javascript:alert('${userInput}')`;

// GOOD: Validate protocol and encode
const url = new URL(userInput, location.origin);
if (!['http:', 'https:'].includes(url.protocol)) {
	throw new Error('Invalid protocol');
}
```

### Event Handlers

```javascript
// BAD: eval() or Function() with user input
const fn = new Function('return ' + userInput);

// GOOD: Never use eval or Function constructor with untrusted data
// Use safe alternatives like JSON.parse for data
const data = JSON.parse(userInput);
```

## Content Security Policy (CSP)

### Recommended CSP Headers

Set via HTTP headers (server-side) or meta tags (less secure):

```html
<!-- Strict CSP: Only allow same-origin resources -->
<meta
	http-equiv="Content-Security-Policy"
	content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';"
/>
```

**Policy Directives:**

- `default-src 'self'`: Default to same-origin for all resource types
- `script-src 'self'`: Only load scripts from same origin
- `style-src 'self' 'unsafe-inline'`: Allow inline styles (use sparingly)
- `img-src 'self' data: https:`: Allow images from same origin, data URIs, and HTTPS
- `connect-src 'self'`: Only allow fetch/XHR to same origin
- `frame-ancestors 'none'`: Prevent clickjacking (same as X-Frame-Options: DENY)
- `upgrade-insecure-requests`: Automatically upgrade HTTP to HTTPS

**Avoid** `'unsafe-inline'` and `'unsafe-eval'` for scripts whenever possible.

### CSP Reporting

```html
<!-- Report violations to an endpoint -->
<meta
	http-equiv="Content-Security-Policy"
	content="default-src 'self'; report-uri /csp-violation-report"
/>
```

## Trusted Types (Modern Browsers)

Trusted Types prevent DOM-based XSS by requiring explicit trust for dangerous sinks:

```javascript
// Enable Trusted Types via CSP
// Content-Security-Policy: require-trusted-types-for 'script'

// Create a policy
const policy = trustedTypes.createPolicy('myPolicy', {
	createHTML: (input) => DOMPurify.sanitize(input),
	createScriptURL: (input) => {
		if (new URL(input, location.origin).origin === location.origin) {
			return input;
		}
		throw new TypeError('Invalid script URL');
	},
});

// Use the policy
element.innerHTML = policy.createHTML(userInput);
```

## Client-Side Validation

### Purpose of Client-Side Validation

- **UX Only:** Provide immediate feedback to users
- **Never Rely on It:** Always validate on the backend; client-side can be bypassed

### Validation Patterns

```javascript
// Email validation (basic format check)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
	showError('Invalid email format');
}

// Input sanitization (remove dangerous characters for display)
const sanitized = userInput.replace(/[<>]/g, '');

// Length validation
if (password.length < 8) {
	showError('Password must be at least 8 characters');
}
```

**Never use client-side validation for security decisions** - it's trivial to bypass with browser DevTools or direct API calls.

## Secure Data Storage

### LocalStorage and SessionStorage

```javascript
// BAD: Storing sensitive data in localStorage
localStorage.setItem('authToken', jwtToken); // Accessible to XSS

// GOOD: Use HttpOnly cookies for sensitive data (set server-side)
// Or use sessionStorage for short-lived, non-sensitive data
sessionStorage.setItem('userPreference', theme);
```

**Rules:**

- **Never** store authentication tokens, passwords, or PII in localStorage/sessionStorage
- Use `HttpOnly`, `Secure`, `SameSite` cookies for auth tokens (set server-side)
- LocalStorage is accessible to any JavaScript on the page (XSS risk)

### IndexedDB

- Suitable for larger client-side data
- Same XSS risk as localStorage
- Encrypt sensitive data before storing (not recommended for auth tokens)

## Authentication and Session Management

### Token Storage

```javascript
// BAD: Store token in localStorage
localStorage.setItem('token', token);

// GOOD: Use HttpOnly cookie (set by server)
// The browser automatically includes the cookie in requests
// JavaScript cannot access HttpOnly cookies

// If you must use localStorage (e.g., mobile app), understand the XSS risk
```

### Token Transmission

```javascript
// GOOD: Send token in Authorization header
fetch('/api/data', {
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

// Or rely on HttpOnly cookie (automatically sent)
fetch('/api/data', {
	credentials: 'include', // Include cookies in cross-origin requests
});
```

### Logout

```javascript
// Clear any client-side tokens
localStorage.removeItem('token');
sessionStorage.clear();

// Invalidate session on server
await fetch('/api/logout', { method: 'POST' });

// Redirect to login
window.location.href = '/login';
```

## Clickjacking Prevention

### X-Frame-Options and frame-ancestors

Set via HTTP header (server-side):

```
X-Frame-Options: DENY
```

Or via CSP:

```
Content-Security-Policy: frame-ancestors 'none'
```

**frame-ancestors** is more flexible:

- `frame-ancestors 'none'`: Equivalent to DENY
- `frame-ancestors 'self'`: Allow same-origin framing
- `frame-ancestors https://trusted.com`: Allow specific origins

## CORS and Cross-Origin Security

### Preflight Requests

- Browser sends OPTIONS request for cross-origin requests with custom headers
- Server must respond with appropriate CORS headers

### CORS Headers (Set Server-Side)

```
Access-Control-Allow-Origin: https://trusted.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

**Never use** `Access-Control-Allow-Origin: *` with credentials.

### Fetch with Credentials

```javascript
// Include cookies in cross-origin requests
fetch('https://api.example.com/data', {
	credentials: 'include',
});
```

## Subresource Integrity (SRI)

Ensure third-party scripts haven't been tampered with:

```html
<!-- Include integrity hash for CDN resources -->
<script
	src="https://cdn.example.com/library.js"
	integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
	crossorigin="anonymous"
></script>
```

Generate SRI hashes: https://www.srihash.org/

## Form Security

### CSRF Protection

```html
<!-- Include CSRF token in forms (server generates token) -->
<form
	action="/submit"
	method="POST"
>
	<input
		type="hidden"
		name="csrf_token"
		value="{{ csrfToken }}"
	/>
	<!-- form fields -->
</form>
```

For AJAX:

```javascript
// Include CSRF token in headers
fetch('/api/submit', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'X-CSRF-Token': csrfToken,
	},
	body: JSON.stringify(data),
});
```

### Form Input Validation

```html
<!-- HTML5 validation attributes (UX only) -->
<input
	type="email"
	required
	pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
/>
<input
	type="password"
	required
	minlength="8"
/>
```

## Open Redirect Prevention

```javascript
// BAD: User-controlled redirect
const redirectUrl = new URLSearchParams(location.search).get('return_to');
window.location.href = redirectUrl; // Can redirect to evil.com

// GOOD: Validate against allowlist
const allowedOrigins = ['https://app.example.com', 'https://www.example.com'];
const redirectUrl = new URLSearchParams(location.search).get('return_to');
const url = new URL(redirectUrl, location.origin);

if (allowedOrigins.includes(url.origin)) {
	window.location.href = url.href;
} else {
	window.location.href = '/'; // Default safe redirect
}
```

## Third-Party Dependencies

### Minimize Dependencies

- Every dependency increases attack surface
- Regularly audit with `npm audit`, `yarn audit`, or Snyk

### Pin Versions

```json
{
	"dependencies": {
		"vue": "3.4.0", // Exact version, not ^3.4.0 or ~3.4.0
		"react": "18.2.0"
	}
}
```

### Verify Package Integrity

- Check package reputation and maintainership
- Review recent commits and issues
- Use tools like Socket.dev to scan for suspicious behavior

## Security Headers Checklist

Set via server-side configuration (not always possible via client-side):

- [ ] `Content-Security-Policy`: Restrict resource origins
- [ ] `X-Content-Type-Options: nosniff`: Prevent MIME sniffing
- [ ] `X-Frame-Options: DENY` or `CSP frame-ancestors`: Prevent clickjacking
- [ ] `Strict-Transport-Security: max-age=31536000; includeSubDomains`: Force HTTPS
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`: Control referrer information
- [ ] `Permissions-Policy`: Restrict browser features (camera, microphone, etc.)

## Practical Examples

### Secure Form Submission

```vue
<template>
	<form @submit.prevent="handleSubmit">
		<!-- Client-side validation for UX -->
		<input
			v-model="email"
			type="email"
			required
		/>
		<input
			v-model="password"
			type="password"
			minlength="8"
			required
		/>
		<button type="submit">Login</button>
	</form>
</template>

<script>
export default {
	methods: {
		async handleSubmit() {
			// Client-side validation (UX)
			if (!this.email || !this.password) {
				alert('Please fill in all fields');
				return;
			}

			try {
				// Server validates and authenticates
				const response = await fetch('/api/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include', // Include HttpOnly cookies
					body: JSON.stringify({
						email: this.email,
						password: this.password,
					}),
				});

				if (response.ok) {
					window.location.href = '/dashboard';
				} else {
					alert('Login failed');
				}
			} catch (error) {
				console.error('Login error:', error);
			}
		},
	},
};
</script>
```

### Sanitizing User Content

```javascript
import DOMPurify from 'dompurify';

// User-generated HTML content (e.g., rich text editor)
const userHtml = '<script>alert("XSS")</script><p>Safe content</p>';

// Sanitize before rendering
const cleanHtml = DOMPurify.sanitize(userHtml, {
	ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
	ALLOWED_ATTR: ['href'],
});

// Now safe to use with v-html or innerHTML
element.innerHTML = cleanHtml; // Output: <p>Safe content</p>
```

## Framework-Specific Guidance

### React

- Use JSX (auto-escapes by default)
- Avoid `dangerouslySetInnerHTML`
- Use `react-helmet` for CSP meta tags
- Validate props with PropTypes or TypeScript

### Vue

- Use `{{ }}` interpolation (auto-escapes)
- Avoid `v-html` unless necessary
- Use `vue-meta` or `@vueuse/head` for CSP meta tags
- Validate props with TypeScript or validators

### Angular

- Use `{{ }}` interpolation (auto-escapes)
- Avoid `[innerHTML]` unless necessary
- Angular's built-in sanitizer is limited; use DOMPurify for complex HTML
- Use Angular's HttpClient (includes XSRF protection)

## Security Testing

### Manual Testing

- Test with `<script>alert('XSS')</script>` in all input fields
- Inspect localStorage/sessionStorage for sensitive data
- Check network tab for tokens in URLs or response bodies
- Verify CSP violations in console

### Automated Tools

- OWASP ZAP: Web application security scanner
- Burp Suite: Intercept and modify requests
- Lighthouse: Includes security audits
- npm audit / Snyk: Dependency vulnerability scanning

## References

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Trusted Types](https://web.dev/trusted-types/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## Summary

Frontend security is about:

- **Encoding output** to prevent XSS
- **Using CSP** to restrict resource origins
- **Avoiding client-side secrets** in localStorage
- **Validating on the backend** (client-side is UX only)
- **Layering defenses** for comprehensive protection

Remember: The frontend is untrusted territory. All security decisions must be enforced on the backend!
