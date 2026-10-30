---
name: match-component
description: Rigorously compare a React component against its Figma source of truth and fix the differences. Use when a user asks to audit, verify, compare, match, align, or pixel-check a component's visual implementation against Figma; do not use for broad code-quality review.
compatibility: Requires repository access and inspectable Figma design context.
---

# Figma-to-React Parity Audit

Treat Figma as the visual source of truth. This is a strict implementation audit, not a broad code-quality review: exact color, dimensions, spacing, typography, borders, radii, shadows, assets, and interaction-state values matter.

## Audit boundary

1. Read `docs/REFERENCE_TABLE.md` when it exists. It must map a component name
   to its canonical Figma reference; the exact header labels may vary. Use the
   matching row to resolve a Figma node for the requested component.
2. If no matching row or Figma reference exists, ask the user for the Figma
   node.
3. Audit only the named component or bounded group. Audit a child component
   only when it contributes to the requested component's visible result.
4. A reference table may include an implementation `Status` and other fields,
   but they are informational only: they do not select audit scope and must
   not be changed.

## Required sources

Read these before the implementation comparison:

- The component's public API, rendering files, and every directly imported
  style source: CSS, preprocessor files, CSS-in-JS, utility definitions, and
  typography or layout helpers that contribute to its visible result.
- Canonical token definitions and generated outputs when the project has them,
  discovered from imports, build configuration, or design-system tooling.
- Any composed design-system primitive that contributes to the result.

Use `rg` to find imports and declarations. Do not assume that a component's directory contains all of its visible styles.

## Figma inspection

Follow the prerequisites of the available Figma inspection tool. Then inspect
the requested node and every relevant variant/state shown by Figma:

- default, hover, active/pressed, selected, disabled, focus, and open/closed states when present;
- each size, orientation, density, and semantic variant;
- nested atoms, icon instances, dividers, and assets;
- root constraints (`min/max-width`, `min/max-height`) separately from a presentation frame's fixed dimensions. A table cell with equal min and max is fixed; a cell with only a min stays fluid.

Verify that library-component instances in Figma correspond to the matching
code components.

Record the actual Figma values and token bindings. A screenshot alone is insufficient when inspectable Figma properties or variables are available.

### Inspection pitfalls

- **Image colors:** a fill can carry image adjustments (hue, saturation,
  exposure) that design-context and variable tools do not show. Verify an
  icon's color against the node's rendered export, not against the raw image
  fill.
- **Instance content:** design context can return a nested instance with its
  main component's defaults (placeholder text, a default icon or color)
  instead of the applied overrides. Confirm visible content against a
  screenshot of that exact node before reporting a Figma inconsistency.
- **Usage counts:** instance lookups may cover only the loaded page. Never
  conclude that a component is unused from an instance count; inspect the
  likely parent components instead.
- **Legacy font variables:** a legacy Figma font variable can differ from the
  project's current font token. Record an approved mapping and its approval
  source in the comparison ledger; record an unapproved family as a mismatch,
  or unresolved design authority as a verification limit that prevents PASS.

## Exhaustive CSS comparison

Build a line-by-line comparison ledger for every applicable visual declaration
in every style source that affects the requested component. Include:

- root, descendants, modifiers, nested selectors, pseudo-classes/elements, media queries, and state selectors;
- typography or style mixins, utility classes, and style helpers; inspect their definitions and record the effective declarations they introduce;
- CSS custom properties, inherited typography, `var()` fallbacks, and properties supplied through composed atoms;
- layout (`display`, position, flex/grid, gaps, alignment, sizing, overflow), box model, colors/opacity, typography, borders/radius, shadows, transforms, filters, backgrounds, and asset dimensions.

For each source declaration, record its file and line, selector, property, literal/token expression, resolved rendered value, matching Figma property/value, and verdict. Do not skip a line because it appears cosmetic or because another declaration seems similar.

Also account for Figma properties that have no matching CSS line. They are discrepancies too.

## Rendered measurement

When the component can be rendered (for example in Storybook), measure the
rendered result with a browser: box sizes, gaps between elements, positions
relative to their container, and computed colors and fonts. Compare these
numbers with Figma, and record them as ledger evidence.

For UI that renders only inside an embedded engine, a browser preview that
stubs the engine API serves as the browser; without one, follow the project's
in-engine instructions.

Reading CSS is not enough for layout. Padding added on top of a width
(`content-box`), wrapper elements that a primitive inserts between a container
and its children, and inherited styles all change the result without appearing
in the component's own style sources. Render the story that shows the Figma
example, not a made-up one, so the numbers are comparable.

## Token policy

Resolve every visual value against the project's canonical token sources,
typography helpers, and Figma variable bindings where available.

Pass a value only when one of these is true:

1. The React declaration uses a canonical token of matching value and purpose.
2. No corresponding token exists, and the code uses Figma's exact literal in its native CSS unit. Stroke widths, colors, opacity, and shadows preserve their exact values.
3. The declaration is supplied by the matching design-system primitive and its
   own audited API guarantees the exact Figma value.

Do not create `calc()` expressions by combining approximate tokens to recreate a Figma value. If a token exists but resolves to another value, it is a mismatch. Do not approve a hardcoded value when a canonical token of matching value and purpose exists.

## Equivalent implementations

Alternative code is allowed only when its effective visual result is exactly equal for every relevant variant and state. For example, flex and grid can be equivalent only if measured dimensions, alignment, gaps, and overflow behavior match exactly.

For every accepted alternative, write the evidence in the ledger: the Figma value, the resolved React value, affected states, and why the result is equal. A visual resemblance, an unmeasured screenshot, or an approximate token is never sufficient.

## State and interaction checks

Compare state styling explicitly. Verify that:

- disabled, selected, focus, hover, active, and open states match the Figma state that defines them;
- a CSS selector cannot accidentally override another state's visual values;
- asset selection, tint/filter, and intrinsic sizing match Figma exactly.

## Corrections

Correct every mismatch in the same pass with exact changes supported by
Figma/token evidence, then re-run the ledger rows and measurements of the
affected scope. A mismatch whose correction needs a missing token, a choice
between conflicting Figma sources, or a change outside the requested component
stays open.

## Result format

The record is the audit file, stored where the project or user names,
otherwise at `docs/audits/<Component>.md`. The user must be told the result,
the changed lines, the open mismatches and verification limits, and where the
audit file is.

Keep file paths, identifiers, token names, and Figma labels unchanged. The audit
file, not the reply, uses this exact structure and omits an empty section:

```md
## Figma-to-React audit: <Component>

**Scope:** <component, Figma node, variants/states, React files>
**Result:** PASS | FAIL | BLOCKED

### Open mismatches
| Style source:line | Property | React resolved value | Figma value/token | Evidence / why it stays open |
|---|---|---|---|---|

### Verification limits
- <unavailable Figma state, asset, or runtime condition>
```

`PASS` requires no open mismatches and no unresolved verification limits. `BLOCKED` is required if the requested component or Figma node is unavailable, or necessary Figma/runtime evidence cannot be obtained.
