# Forget-Me-Note — brain dump (organized)

## Short summary

This doc captures the feature ideas, goals, UX patterns, integration points, and open questions for a lightweight, local-first note-taking app that combines quick capture with AI assistance and syncing across devices.

## Goals

- Fast capture: add a single line or quick note from anywhere with minimal friction.
- Local-first: immediate local storage for speed and offline access, with background sync to a remote database.
- Flexible organisation: auto-categorisation plus manual control; support folders, tags and simple taxonomies.
- Safe AI assistance: AI can help organise, summarise, or generate todos but should not silently rewrite user content.

## Core features

Capture

- One-line quick capture from any context.
- Create new note pages (e.g., meeting notes) quickly.
- Save webpages / research clippings ("mem note").

Organization & metadata

- Auto-categorise with the option to override manually.
- Support hierarchical folders and tags (examples: personal/(shopping|pet|chores), work/(digital-twin|ica|general)).
- Auto-create directories but respect user deletions (don't recreate removed folders automatically).
- Ability to show which file/source the AI used when summarising or answering queries.

Todos & reminders

- Auto-detect todo lists (shopping, chores) and treat them as ephemeral todos that can be deleted when completed.
- Support persistent/archived todos for work items — when marked complete they archive instead of deleting.
- Configurable due dates and reminders; support manual dates or natural-language input (e.g., “do X by Y”).
- Reminder thresholds (example defaults): Normal 24h, Medium 48h, High 72h before due.

Rendering & markup

- Store notes in lightweight markup for LLM consumption.
- Live render: show rich rendering when the cursor is not on a line; option to toggle full render/no render.
- WYSIWYG helpers for non-markup users (UI controls to insert headings, tables, lists).

Sync, accounts & devices

- Login/sync so multiple devices access the same note set.
- Local-first with background upload and conflict resolution on sync.
- On login, pull changes/updates to reconcile local and remote copies.

Notifications & surfaces

- Browser notifications for web app; push/mobile notifications for phone apps (requires mobile port).
- Explore whether an MCP/Copilot server can send active reminders via Teams/VSCodes messages or other channels.

## AI interactions

- Chat interface to query notes: summaries, action items, find when you spoke to someone, etc.
- AI should include references to source files when providing answers.
- Support custom instructions for toolsets, output types, and interaction modes.
- Trigger points: chat, context menu on selection, or a dedicated AI menu. The context menu should include formatting and AI actions.

## UI / UX

- Default layout like VS Code: directories (left), content (center), chat/assistant (right).
- Canvas/brainstorm mode for freeform diagrams and canvas-style notes.
- Templates for meetings, journals, etc.

## Data model & storage

- Local-first storage for speed and privacy; background sync to remote database indexed by day and by note.
- Files/notes should be addressable (so references in AI responses can point back to exact files).
- Organisational boundaries: support separation by project/org to prevent cross-company data leakage.

## Integrations & automation

- Project tools: GitHub Projects (and similar) integration for linking notes to work items.
- Calendar sync: allow users to choose calendars (Google, Microsoft); explore cross-provider syncing and how to represent events as todos/reminders.
- Email summarisation: turn emails into notes/todos.
- Voice transcription and OCR (hand-written notes) — evaluate cost vs value.
- Command integration: allow triggering actions via Copilot/MCP commands (e.g., "/note go shopping after work").

## Open implementation questions / research

- How to store/pull local repo context when working from an IDE? (pulling repo, storage format)
- Can an MCP server (or Copilot flow) actively push reminders to VS Code/Teams/other channels? What are delivery options and limits?
- How to ensure each chat instance is unique per client — server-instantiated sessions vs client-only?
- Cost and approach for handwriting OCR and voice transcription.
- Calendar interop: best practice for syncing Google and Microsoft calendars for the same account.
- Privacy: what PII might be sent to AI services and where to apply redaction or allowlists.

## Misc / UX notes / short ideas

- #tags support and lightweight graph exploration (question: how should graphs work and what data do they show?).
- "Mumble" note for mobile dashboard (quick small note UI).
- Prompted Q&A flows (echo notes) — small guided prompts to turn a note into actions.
- Save websites for research / references (@mem note).
- Projected behavior: If I add a task for a person ("Kathryn"), it should appear in my daily todos and in a Kathryn-specific view.
- Auto-folder behaviour (mem notes does auto folders) — research existing patterns.
- Templates and publish-to-knowledge-hub (inspired by Obsidian Publish).
- Keep links and inline references intuitive; avoid AI rewriting that breaks user flow.

## Next steps (suggested)

1. Prioritise an MVP: quick capture, local storage, simple sync, and todos/reminders.
2. Prototype the UI layout (VS Code-like) and a minimal chat that can summarise a note with a source link.
3. Research MCP/Copilot push capabilities and calendar interoperability.
4. Decide on markup format (markdown-like) and minimal schema for todos and archived items.

## Questions for you

- Which priorities do you want in MVP (capture, sync, AI, mobile)?
- Any must-have integrations for first release (e.g., Google Calendar, GitHub)?
- How conservative should we be about sending content to external LLMs (default redaction policy)?
