---
name: uikit-final-review
description: Run the pre-approval final review for changed UIKit components. Use only when the user asks for a final review, readiness check, or pre-approval verification; apply its checklist, verify relevant checks, update actual Unit Tests state, and never change Status.
---

# UIKit Final Review

Perform the project's final implementation check before the user decides a
component's migration status. This is a verification workflow, not permission
to refactor or to approve a component.

## Scope

1. Identify the changed component and any child atom or composed UIKit
   component that affects its visible result.
2. Read the [final review checklist](references/checklist.md), the matching `docs/REFERENCE_TABLE.md` row,
   relevant source, styles, tests, and stories.
3. Apply every checklist item. Treat a mismatch as a required
   correction; do not waive an item because the default example looks right.

## Verification

Run each relevant project check that the environment permits:

```powershell
yarn lint
yarn typecheck
yarn test
yarn build
```

Do not claim a skipped or unavailable command passed. Report its limit and
the reason. Do not run Playwright visual regression tests during active
migration; visual snapshots are batch work after migration.

For a Figma visual-parity audit, use `check-design` separately. This skill
records whether that evidence is available but does not duplicate its
line-by-line ledger.

## Reference table boundary

- Update only the matching `Unit Tests` cell when actual test evidence changes
  its truthfulness.
- Never change the table's `Status` cell, even when every check passes.
- Do not alter Figma links, source mappings, or unrelated rows.

## Report

Report in the user's language; otherwise use English. Keep commands, paths,
and status values unchanged.
Use this compact structure:

```md
## UIKit final review: <Component>

**Result:** READY | CORRECTIONS REQUIRED | VERIFICATION LIMITED

### Checks
- <FINAL_REVIEW item>: pass | fail | not verified — <evidence>

### Commands
- `<command>`: pass | fail | not run — <reason or relevant result>

### Table
- `Unit Tests`: updated | already accurate | not applicable
- `Status`: unchanged; awaits user approval

### Required corrections
- <only unresolved items; omit this section when empty>

### Verification limits
- <only skipped or unavailable evidence; omit this section when empty>
```

`READY` means every applicable checklist item passed and no verification limit
remains. It is evidence for the user's final decision, never approval to
change status.
