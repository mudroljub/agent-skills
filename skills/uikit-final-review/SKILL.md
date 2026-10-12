---
name: uikit-final-review
description: Run the final review for changed UIKit components. Use when the user asks for a final review, readiness check, or pre-approval verification; apply its checklist, verify relevant checks, and update actual Unit Tests state. Component refactoring and migration status updates are out of scope.
---

# UIKit Final Review

Produce final implementation evidence for changed UIKit components.

## Scope

1. Identify the changed component and any child atom or composed UIKit
   component that affects its visible result.
2. Read the [final review checklist](references/checklist.md), the matching `docs/REFERENCE_TABLE.md` row,
   relevant source, styles, tests, and stories.
3. Apply every checklist item. Treat a mismatch as a required
   correction; do not waive an item because the default example looks right.

## Verification

Run each relevant project check that the environment permits — lint, type
check, tests, and build — using the commands defined in the project's package
manifest.

Do not run Playwright visual regression tests during active
migration; visual snapshots are batch work after migration.

A Figma visual-parity audit is out of scope. This skill
records whether that evidence is available but does not duplicate its
line-by-line ledger.

## Reference table boundary

- When the table has a `Unit Tests` column, update only the matching cell, and
  only when actual test evidence changes its truthfulness.
- The table's `Status` cell is outside this review's scope.
- Do not alter Figma links, source mappings, or unrelated rows.

## Report

Keep commands, paths, and status values unchanged.
Use this compact structure:

```md
## UIKit final review: <Component>

**Result:** READY | CORRECTIONS REQUIRED | VERIFICATION LIMITED

### Checks
- <checklist item>: pass | fail | not verified — <evidence>

### Commands
- `<command>`: pass | fail | not run — <reason or relevant result>

### Table
- `Unit Tests`: updated | already accurate | not applicable
- `Status`: unchanged

### Required corrections
- <only unresolved items; omit this section when empty>

### Verification limits
- <only skipped or unavailable evidence; omit this section when empty>
```

`READY` means every applicable checklist item passed and no verification limit
remains.
