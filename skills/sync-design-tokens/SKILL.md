---
name: sync-design-tokens
description: Set up or update a project's Figma design-token source, generation pipeline, and scoped token adoption. Use when a project needs Figma variables copied into a required tokens folder, generated style outputs, or exact hardcoded-value replacements; do not use for a component visual-parity audit.
---

# Sync Design Tokens

Keep Figma Variables as the design authority and the checked-in `tokens/`
folder as the canonical code input. Generated CSS, SCSS, TypeScript, or other
platform outputs are build artifacts: never edit them by hand.

## Modes

### Setup

Use setup when `tokens/` is absent or the user explicitly asks to establish
the token pipeline.

1. Inspect the project's styling stack, package scripts, source entry points,
   build configuration, and existing generated styles. Identify how global
   tokens must be imported and, for a library, exported to consumers.
2. Obtain the canonical Figma library and the exact Variable collections and
   modes to sync. Read the full collections through an available Variables API
   or a complete Figma/Token Studio export. Searching a component or reading
   variables bound to one node is useful confirmation, but is not a complete
   export.
3. Create `tokens/` as the required, checked-in input folder. Store raw Figma
   values and preserve variable hierarchy, type, scope, aliases, and modes.
   When there is no established project schema, use the existing Figma-token
   shape:

   ```json
   {
     "spacing": {
       "150": {
         "value": 4,
         "type": "number",
         "$extensions": {
           "com.figma.scopes": ["GAP"]
         }
       }
     }
   }
   ```

   Keep modes in distinct, clearly named inputs. Do not flatten aliases into
   literals or derive a token set by inspecting component screenshots.
4. Add the smallest generator appropriate to the project. It must read only
   `tokens/`, generate the project's style outputs, and be available through
   a package script. Retain existing generators and conventions when present;
   do not introduce a second competing token pipeline.
5. Establish the output-unit policy before generating styles. Preserve raw
   Figma pixel dimensions as `px` unless the target product has a documented,
   independently justified scaling contract. Do not inherit a unit convention
   from another runtime or design system without verifying that its mechanism
   exists in the target.
6. Wire generated outputs into the application's global styles. For a
   published library, also expose only the intended token entry points.

### Update

Use update when `tokens/` and a token generator already exist.

1. Read the existing token inputs, generator, generated outputs, and Figma
   source configuration before changing anything.
2. Obtain a complete current export of the configured Figma collections and
   modes. Compare names, values, types, scopes, aliases, and modes against
   `tokens/`.
3. Apply only evidence-backed additions and value changes. Do not delete or
   rename a token that code still uses without reporting the affected usages
   and obtaining a replacement decision.
4. Regenerate all outputs. If the user requests adoption, replace hardcoded
   values only in the requested source scope and only when one token has the
   exact computed value and semantic purpose. Report ambiguous literals rather
   than making a global blind replacement.

## Source and generator rules

- Figma Variable collections are authoritative. Legacy code can be compared
  for compatibility, but it is not a token source.
- If available tooling cannot enumerate the entire required collection, ask
  for a complete export. Do not reconstruct the collection by visiting
  representative components.
- Preserve Figma aliases and mode relationships. A token's displayed resolved
  value alone is not enough to replace its source relationship.
- Map semantic color, typography, dimension, shadow, and gradient tokens
  according to the project's actual Figma collections. Do not assume a fixed
  set or file names.
- A Figma node may omit a Variable binding for a fixed width or height even
  when the canonical size token exists. Treat an exact resolved value together
  with an appropriate `WIDTH_HEIGHT` scope as sufficient evidence to adopt
  that token for `width`, `height`, `min-width`, or `min-height`; do not use a
  spacing token merely because it currently resolves to the same number.
- Keep intrinsic asset geometry separate from a component size contract. Adopt
  a size token for an asset wrapper only when the wrapper has a fixed component
  dimension; otherwise retain the asset-driven dimensions and report the
  ambiguity.
- Do not convert every numeric token to one unit: keep values such as opacity,
  durations, or CSS-native literals in their appropriate units.
- Do not modify component behavior, Figma designs, or unrelated styles as part
  of setup. Scoped hardcoded-value adoption is the only component-style work
  this skill performs.

## Verification

1. Parse every changed token input and ensure the generator reads the complete
   declared input set.
2. Run the token-generation command and inspect the generated outputs for the
   expected names, values, modes, aliases, and units.
3. Run the relevant style/build/type checks the project supports. Do not claim
   a skipped command passed.
4. Verify the generated unit policy preserves the Figma values in the target
   runtime and does not impose an undocumented global host-style contract.

## Report

Report in the user's language; otherwise use English. Include:

- selected mode, Figma collections and modes, and the token input files;
- generator command, generated output locations, and output-unit policy;
- token additions, value changes, retained aliases, and any scoped
  hardcoded-value replacements;
- missing Figma access/export, ambiguous mappings, affected removals, and
  checks that could not run.
