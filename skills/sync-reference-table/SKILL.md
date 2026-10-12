---
name: sync-reference-table
description: Set up, update, or close rows of docs/REFERENCE_TABLE.md, which maps project components to canonical Figma references. Use when creating the component inventory, reconciling Figma, code, and table changes, or finishing an in-progress row one at a time (for example "compare the next one with Figma", "close this row", "mark it done").
---

# Sync Reference Table

Keep `docs/REFERENCE_TABLE.md` aligned with the canonical Figma component
library and the project's public component code. List only the project's own
components, never a library's; recheck every story link after a story title
changes. Choose one `Component` link
convention for the whole table: in projects with Storybook, link only to a
component's own story and leave components without one unlinked; in projects
without Storybook, link to source files. `Figma` is its canonical Figma link,
and `Status` records implementation state.

## Modes

### Setup

Use setup when the table does not exist or the user explicitly asks to rebuild
the inventory.

1. Inspect the supplied Figma library and collect its components, component
   sets, variants, and canonical node links.
2. Inspect the project's public exports, source, and stories to collect
   existing components and their review links.
3. Use code to identify the matching public component. When the project has
   Storybook, link `Component` only to its own story and leave it unlinked
   when no such story exists. When the project has no Storybook, link it to the
   source file. A name match alone is not proof; report ambiguity instead of
   guessing.
4. Create `docs/REFERENCE_TABLE.md` when it is absent with:

   ```md
   | Component | Figma | Status |
   |---|---|---|
   ```

   Leave `Status` empty unless the user supplies its meaning and evidence.
   Preserve an existing table unless the user explicitly requests a rebuild.

### Update

Use update when the table exists and Figma, code, or the table itself has
changed.

1. Read the existing rows, current Figma library, and public component exports.
2. Add missing component rows and refresh stale Component or Figma links
   supported by evidence from Figma, code, and stories.
3. Preserve rows and project-specific columns that cannot be verified from
   Figma and code. Report ambiguous, removed, or conflicting mappings instead
   of guessing or deleting them.

### Close a row

Use close when the user wants to finish an in-progress row, usually one row at
a time in table order.

1. Ask the user to compare the row's story with its Figma reference visually.
2. Audit the component's tokens and measurements against Figma and record
   the differences with evidence.
3. Check that the component name and its prop and variant names match the
   Figma component. Propose a rename when they differ.

Write a status note on its own line after the status label, for example
`🔄 In progress<br>Needs translations`, never in parentheses. Keep a note only
while it records something still open.

## Figma references

Use available Figma inspection tools to confirm every new or changed node;
follow the chosen tool's prerequisites. A canonical link identifies the actual
component or component set and opens a useful, human-readable reference frame.
Do not substitute a broad page, tutorial, or isolated variant merely because it
is easier to find. If several credible nodes remain, report the candidates.

## Storybook link verification

When a Storybook project is used, validate every new or refreshed component URL
against its active story index (commonly `/index.json`, or the generated static
index). Match the exact docs entry ID produced by the story title; do not guess
an ID from a file path. If the index does not contain a newly added story after
a discovery or configuration change, restart the dev server when appropriate and
recheck before changing the reference table.

## Boundaries

- The scope is `docs/REFERENCE_TABLE.md`; close mode also covers the affected
  components and stories.
- Do not modify Figma designs or unrelated documentation.
- Preserve existing rows and project-specific fields.
- Do not claim visual parity.

## Report

Include only actionable results:

- table created or updated, with the selected mode;
- rows added or changed and their Figma nodes;
- ambiguous or stale rows requiring a user decision.
