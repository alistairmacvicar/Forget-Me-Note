## Summary

Describe the change clearly and link any related issue.

## Change Type

- [ ] Feature
- [ ] Fix
- [ ] Refactor
- [ ] Docs
- [ ] Chore

## Checklist

### Code Quality

- [ ] N/A - No code changes
- [ ] Small, focused diff (< ~400 LOC or justified)
- [ ] Follows existing patterns and conventions in the codebase
- [ ] No unsolicited refactors outside scope

### Security

- [ ] N/A - No security-relevant changes
- [ ] All new inputs validated (API endpoints, user inputs, external data)
- [ ] No secrets added / hardcoded
- [ ] No unsafe operations (HTML injection, command execution, file access) without sanitization rationale

### Performance

- [ ] N/A - No performance impact
- [ ] Avoids recreating heavy objects or state in hot paths
- [ ] Reuses shared utilities and helper functions where applicable
- [ ] Large loops, recursive operations, or high-frequency operations justified

### Testing

- [ ] N/A - No testable changes (docs, comments, etc.)
- [ ] Added/updated tests (unit, integration, or E2E)
- [ ] Manually tested (describe below)

### Documentation

- [ ] N/A - No documentation needed
- [ ] Public API, interface, or shared module changes documented
- [ ] README or inline comments updated where needed

### Observability & Errors

- [ ] N/A - No error handling changes
- [ ] Error paths use existing patterns (structured, not silent)

## Screenshots / Evidence (if UI)

Attach before/after or GIF.

## Risk / Rollback Plan

Explain impact and how to revert quickly.

## Additional Notes

Anything reviewers should know (assumptions, follow-ups).
