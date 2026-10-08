---
name: check-design
description: Rigorously compare a React component against its Figma source of truth. Use when a user asks to audit, verify, compare, match, align, or pixel-check a component's visual implementation against Figma; do not use for broad code-quality review.
compatibility: Requires repository access and inspectable Figma design context.
---

# Figma-to-React Parity Audit

Treat Figma as the visual source of truth. This is a strict implementation audit, not a broad code-quality review: exact color, dimensions, spacing, typography, borders, radii, shadows, assets, and interaction-state values matter.

## Audit boundary

1. Read `docs/REFERENCE_TABLE.md` when it exists. It must map a component name
   to its canonical Figma reference; the exact header labels may vary. Use the
   matching row to resolve a Figma node for the requested component.
2. If no matching row or Figma reference exists, ask the user for the Figma
   node rather than guessing from a component name.
3. Audit only the named component or bounded group. Audit a child component
   only when it contributes to the requested component's visible result.
4. A reference table may include an implementation `Status` and other fields,
   but they are informational only: they do not select audit scope and must
   not be changed.
5. This audit is read-only evidence. It never grants approval to release,
   merge, or change project tracking data.

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
- root constraints (`min/max-width`, `min/max-height`) separately from a presentation frame's fixed dimensions.

Record the actual Figma values and token bindings. A screenshot alone is insufficient when inspectable Figma properties or variables are available.

When Figma uses an instance of an existing design-system primitive, require the
matching primitive in React when the target project provides one. Do not accept
a hand-drawn CSS imitation as an equivalent implementation.

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
- **Legacy font variables:** when text is bound to a legacy font variable that
  the project has replaced, use the project's current font token for the
  family, take size and line height from Figma, and do not report the family
  as a mismatch.

## Exhaustive CSS comparison

Build a line-by-line comparison ledger for every applicable visual declaration
in every style source that affects the requested component. Include:

- root, descendants, modifiers, nested selectors, pseudo-classes/elements, media queries, and state selectors;
- typography or style mixins, utility classes, and style helpers; inspect their definitions and record the effective declarations they introduce;
- CSS custom properties, inherited typography, `var()` fallbacks, and properties supplied through composed atoms;
- layout (`display`, position, flex/grid, gaps, alignment, sizing, overflow), box model, colors/opacity, typography, borders/radius, shadows, transforms, filters, backgrounds, and asset dimensions.

For each source declaration, record its file and line, selector, property, literal/token expression, resolved rendered value, matching Figma property/value, and verdict. Do not skip a line because it appears cosmetic or because another declaration seems similar.

Also account for Figma properties that have no matching CSS line. They are discrepancies, not omissions from the report.

## Rendered measurement

When the component can be rendered (for example in Storybook), measure the
rendered result with a browser: box sizes, gaps between elements, positions
relative to their container, and computed colors and fonts. Compare these
numbers with Figma, and record them as ledger evidence.

Reading CSS is not enough for layout. Padding added on top of a width
(`content-box`), wrapper elements that a primitive inserts between a container
and its children, and inherited styles all change the result without appearing
in the component's own style sources. Render the story that shows the Figma
example, not a made-up one, so the numbers are comparable.

## Token policy

Resolve every visual value against the project's canonical token sources,
typography helpers, and Figma variable bindings where available.

Pass a value only when one of these is true:

1. The React declaration uses the canonical token that resolves to Figma's exact value.
2. No corresponding token exists, and the code uses Figma's exact literal in its native CSS unit. Stroke widths, colors, opacity, and shadows preserve their exact values.
3. The declaration is supplied by the matching design-system primitive and its
   own audited API guarantees the exact Figma value.

Canonical token sources define the generated representation of design tokens,
not a mandatory representation for every un-tokenized Figma literal. Do not
infer a required unit conversion when Figma specifies an exact literal.

Do not create `calc()` expressions by combining approximate tokens to recreate a Figma value. If a token exists but resolves to another value, report a mismatch. Do not approve a hardcoded value when an exact canonical token exists.

## Equivalent implementations

Alternative code is allowed only when its effective visual result is exactly equal for every relevant variant and state. For example, flex and grid can be equivalent only if measured dimensions, alignment, gaps, and overflow behavior match exactly.

For every accepted alternative, write the evidence in the ledger: the Figma value, the resolved React value, affected states, and why the result is equal. A visual resemblance, an unmeasured screenshot, or an approximate token is never sufficient.

## State and interaction checks

Compare state styling explicitly. Verify that:

- disabled, selected, focus, hover, active, and open states match the Figma state that defines them;
- a CSS selector cannot accidentally override another state's visual values;
- asset selection, tint/filter, and intrinsic sizing match Figma exactly.

## Result format

Write the full report to a file, not into the reply: use the location the
project or user names, otherwise `docs/audits/<Component>.md`. In the reply,
give only the result, the first required correction (if any), and the report
path; the remaining corrections are handled one at a time.

Write the report in the user's language; otherwise use English. Keep file
paths, identifiers, token names, and Figma labels unchanged. Use this exact
structure:

```md
## Figma-to-React audit: <Component>

**Scope:** <component, Figma node, React files>
**Variants/states checked:** <list>
**Result:** PASS | FAIL | BLOCKED

### Line-by-line ledger
| Style source:line | Selector / effective source | Property | React resolved value | Figma value/token | Verdict | Evidence / allowed alternative |
|---|---|---|---|---|---|---|
...

### Missing or extra visual rules
- <Figma property without code, or code rule without Figma counterpart>

### Required corrections
- <only exact mismatches, ordered by visual impact>

### Token summary
- <canonical tokens confirmed>
- <missing exact tokens and exact permitted literals>

### Verification limits
- <unavailable Figma state, asset, or runtime condition; omit this section if none>
```

`PASS` requires an empty **Required corrections** section and no unresolved verification limits. `BLOCKED` is required if the requested component or Figma node is unavailable, or necessary Figma/runtime evidence cannot be obtained.

## Change behavior

Audit is read-only by default. Do not change implementation, tokens, stories,
tests, or project tracking data unless the user explicitly asks to fix the
reported mismatches. When asked to fix them, preserve the ledger, make only
exact corrections supported by Figma/token evidence, then re-run the affected
scope and report the changed lines.
