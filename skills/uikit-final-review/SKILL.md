---
name: uikit-final-review
description: Run the pre-approval checklist for a changed UI-library component. Use when the user asks for that component's final review or readiness check; apply its checklist, fix failed checks, and verify relevant checks. Not for plans, pages, PRs, or Figma parity; component refactoring and migration status updates are out of scope.
---

# UIKit Final Review

Bring changed UIKit components to approval readiness and produce the final
evidence.

## Scope

1. Identify the changed component and any child atom or composed UIKit
   component that affects its visible result.
2. Read the [final review checklist](references/checklist.md), the matching `docs/REFERENCE_TABLE.md` row,
   relevant source, styles, tests, and stories.
3. Apply every checklist item and fix each failed item whose correction the
   sources settle; do not waive an item because the default example looks
   right.

## Verification

Run each relevant project check that the environment permits — lint, type
check, tests, and build — using the commands defined in the project's package
manifest. Fix each failure whose cause and correction are clear, then run that
check again.

Do not run Playwright visual regression tests while components
are still changing; visual snapshots are batch work once they settle.

A Figma visual-parity audit is out of scope. This skill
records whether that evidence is available but does not duplicate its
line-by-line ledger.

## Reference table boundary

- When the table has a `Unit Tests` column, verify that the matching cell agrees
  with the test evidence, like any other checklist item.
- The table's `Status` cell is outside this review's scope.
- Do not alter Figma links, source mappings, or unrelated rows.

## Report

The record is the corrected component files and, when it was wrong, the
corrected `Unit Tests` cell in `docs/REFERENCE_TABLE.md`.

Tell the user the result (`READY`, `DECISION REQUIRED`, or
`VERIFICATION LIMITED`), whether the `Unit Tests` cell changed, the corrections
made, every failed check or command left for a decision with its evidence, and
every check or command that could not be verified or run, with the reason.

`READY` means every applicable checklist item passed and no verification limit
remains.
