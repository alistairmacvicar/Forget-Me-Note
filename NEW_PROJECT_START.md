# NEW PROJECT START-UP CHECKLIST

Keep this file handy and read it at the start of every new repository or new project within this repo. It's a short, ordered checklist of the minimal steps I perform every time. Follow the steps in order.

Quick purpose

- One-page checklist to bootstrap a new repo: collect metadata, initialize the project, generate workflow specs, create a README, confirm owners, commit and open the first PR.

Ordered checklist (do these in this order)

1.  Run the start-project prompt

    - Run: `.github/prompts/start-project.prompt.md`
    - Goal: capture project name, primary language, package names, license, CI preferences and any special options.

2.  Initialize project files (pick the appropriate initialization)

    - Node (minimal):
      npm init -y
    - Node + TypeScript:
      npm init -y; npm install -D typescript; npx tsc --init
    - Python (venv):
      python -m venv .venv; .\.venv\Scripts\Activate.ps1; New-Item -Path requirements.txt -ItemType File
    - Poetry (Python):
      pip install poetry; poetry init --no-interaction
    - .NET (C#):
      dotnet new console -n MyApp
    - Docs-only / minimal repo:
      New-Item -Path README.md -ItemType File; New-Item -Path .github -ItemType Directory

3.  Run the workflow specification prompt (immediately after start-project)

    - Run: `.github/prompts/workflow-spec-creation.prompt.md`
    - Goal: produce a machine- and human-friendly spec for the CI/CD workflows you will add or modify. This step should be done right after capturing project metadata so the specs reflect your chosen stack and CI targets.

4.  Generate README

    - Run: `.github/prompts/readme-creation.prompt.md`
    - Goal: synthesize the project's README using `.github` documentation and the metadata captured earlier.

5.  Verify & update CODEOWNERS

    - Path: `.github/CODEOWNERS` (or `/CODEOWNERS` if you prefer root)
    - Minimal entry example:

      # CODEOWNERS assigns required reviewers automatically.

      Root (global fallback)

      -       @alistairmacvicar

    - If you change it, commit with message: `chore: update CODEOWNERS`

6.  First commit, push and open PR

    - Commit everything and push to a short-lived branch, then open a PR for initial review.
    - Suggested commit messages:
      - `chore: initialize project` (for initial files)
      - `chore: add README and CODEOWNERS`

7.  Enable branch protection & CI gates
    - Protect `main` (or your default branch) with required status checks after CI and other checks exist.

Quick PowerShell commit example

```
git add .; git commit -m "chore: initialize project"; git push -u origin HEAD
```

Notes / reminders

- Prefer running `start-project.prompt.md` before any file creation so the metadata is captured and consistent.
- Run the workflow-spec prompt after `start-project` — it is intended to produce the workflow spec that matches your stack and CI goals.
- Keep changes minimal in first PR: test, lint, and simple README are fine. Iterate on workflows and protections in follow-up PRs.
- If you need automation, you can run the prompts via your agent UI; otherwise run them manually and paste outputs into the repo.

If you want this file to include additional project templates or company-specific defaults, tell me what to add and I'll update it.
