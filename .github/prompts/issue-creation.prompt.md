---
mode: 'agent'
description: 'Create GitHub Issues from implementation plan phases using available issue templates via gh CLI commands.'
---

# Create GitHub Issue from Implementation Plan

Create GitHub Issues for the implementation plan at `${file}`.

## Process

1. Analyze plan file to identify phases
2. Check existing issues using `gh issue list`
3. Create new issue per phase using `gh issue create` or update existing with `gh issue edit`
4. Use appropriate issue template based on phase type:
   - `feature_request.md` for new features or enhancements
   - `chore_request.md` for maintenance, refactoring, or technical debt
   - `bug_report.md` for defect fixes
   - Fallback to default if no template matches

## Requirements

- One issue per implementation phase
- Clear, structured titles and descriptions
- Include only changes required by the plan
- Verify against existing issues before creation

## Issue Content

- Title: Phase name from implementation plan
- Description: Phase details, requirements, and context
- Labels: Appropriate for issue type (feature/chore)
