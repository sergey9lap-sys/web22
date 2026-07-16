# Codex Agent Playbook for Sergey Lapin

This folder contains agent-ready instructions for creating websites.

## Files

### AGENTS.md
Main behavior rules for Codex or any website-building agent.

Use it as the primary instruction file in the project root.

### DESIGN_RULES.md
Detailed visual design rules.

Use it when building layouts, typography, composition, animation, and responsive sections.

### REVIEW_CHECKLIST.md
Final checklist before completing a website task.

Use it before every handoff.

## Recommended Project Placement

Place files in the project root:

```txt
/AGENTS.md
/DESIGN_RULES.md
/REVIEW_CHECKLIST.md
```

Or keep `AGENTS.md` in root and place the others in:

```txt
/docs/DESIGN_RULES.md
/docs/REVIEW_CHECKLIST.md
```

## Important Missing Points Added

Compared to the long human-readable draft, this agent version also adds:

- Design Tokens;
- Mobile First Animation Rule;
- stricter agent priority order;
- interaction state checklist;
- final completion checklist.
