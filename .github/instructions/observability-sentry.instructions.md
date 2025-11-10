---
applyTo: '**'
description: 'Guidelines for integrating and operating Sentry (or similar observability) across client and server with security, privacy, and performance in mind.'
---

<!-- Based on/Inspired by: https://github.com/github/awesome-copilot -->

# Observability (Sentry) Guidance

This guidance defines how to add and operate error and performance monitoring consistently across the codebase. It is intentionally tool-agnostic but assumes Sentry-like capabilities.

## Scope & Environments

- Monitor client (Vue/Nuxt) runtime errors and server (h3/Nitro) exceptions.
- Use distinct environments (development, staging, production) with different sampling.
- Default to disabled or very low sampling in local development to avoid noise and cost.

## Configuration & Secrets

- Configuration must come from environment variables only. Do not hardcode DSNs or tokens.
- Recommended keys: SENTRY_DSN, SENTRY_ENVIRONMENT, SENTRY_RELEASE, TRACES_SAMPLE_RATE, PROFILES_SAMPLE_RATE.
- Validate presence/format of required variables at startup and fail fast in production if misconfigured.

Copilot directives:

- When asked to wire Sentry, reference env access via existing helpers in `app/lib/env.ts` (if applicable) and never inline DSNs.
- Do not suggest storing secrets in repo files. Use `.env` (local dev) and GitHub Secrets for CI/CD.

## Privacy & Data Minimization

- Never send PII by default. Redact or remove user-identifiable data (names, emails, exact coordinates if sensitive) before events are sent.
- Apply allow/deny URL lists to limit noisy or untrusted origins.
- Strip request bodies, headers, and query parameters that may contain secrets unless explicitly allowlisted.

Copilot directives:

- Prefer redaction in a single shared utility rather than scattering filters throughout handlers.
- Avoid logging or rethrowing full error objects that may contain sensitive context.

## Client vs Server Initialization

- Initialize client and server separately to prevent leaking server secrets to the client bundle.
- In universal code paths, gate initialization with clear environment checks.
- Ensure DSN or auth tokens never end up in server logs or front-end source maps accidentally.

Copilot directives:

- For Nuxt, use separate client and server plugins; do not initialize in shared modules by default.
- Ensure tree-shakable imports and client-only execution for browser SDK bits.

## Sampling & Performance

- Choose conservative defaults: low `tracesSampleRate` and `profilesSampleRate` in production; higher rates in staging for diagnostics.
- Instrument only meaningful hot paths (e.g., long-running data transforms) and avoid excessive custom spans.
- Reassess sampling if volume or cost increases; document changes.

Copilot directives:

- Default to conservative sampling in production; allow overrides via env with documented safe ranges.
- Avoid adding performance spans in high-frequency loops unless there is a concrete diagnostic need.

## Source Maps & Releases

- Generate unique release identifiers (e.g., `app@<version>+<short-sha>`).
- Upload source maps during CI only when a Sentry token/secret is available and scoped to minimal permissions.
- Store tokens as GitHub Secrets; never commit credentials. Restrict access via environments.

Copilot directives:

- If proposing a workflow to upload source maps, keep it optional and behind an environment with protected secrets. Do not enable by default.

## Alerts, Ownership & Triage

- Define alert routes by area (frontend, server) and severity.
- Establish a basic triage loop (acknowledge, assign, remediate, verify, silence if noisy).
- Link issues back to commits/releases to speed root cause analysis.

Copilot directives:

- Suggest CODEOWNERS-based ownership mapping where applicable.
- Keep alert rules minimal at first; avoid noisy default rules.

## Testing & Verification

- Provide a safe, non-PII test event procedure for local/staging and document how to disable in test runs.
- Avoid enabling observability in unit/E2E test pipelines unless explicitly required.

Copilot directives:

- Provide a deterministic, non-PII way to emit a test event. Ensure CI does not send events by default.

## Security Alignment

- Follow security guidelines for secrets and input validation.
- Ensure error reports never include sensitive payloads; perform redaction in a single, shared utility where applicable.

Copilot directives:

- Cross-link to `security-and-owasp.instructions.md` and adhere to secret handling and input validation.

## Documentation Expectations

- Update README/CONTRIBUTING and .env.example with required keys and notes when enabling observability.
- Reference this instruction in PRs that introduce or modify observability behavior.

Copilot directives:

- In PR templates, prompt for observability impact when touching error handling or server plugins.
