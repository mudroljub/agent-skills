---
name: check-assets
description: Audit or implement component assets from a design source, especially icon or image variants, sizes, states, tinting, and review examples. Use whenever a component imports, maps, exports, replaces, or displays visual assets; do not use for general visual CSS parity without asset work.
---

# Check Assets

Keep asset ownership, variant mapping, and rendering faithful to the design
source without turning consumer-provided content into bundled component assets.

## Scope

Use this skill for component-owned icons, illustrations, textures, and their
named design variants. It is not a substitute for a full CSS parity review.

## Workflow

1. Read local component, asset, test, and review-example files. Inspect any
   documented component inventory when it is relevant and available. When a
   design tool is involved, follow its required inspection prerequisites.
2. Enumerate every design asset variant that belongs to the component: its
   canonical name, type, size, state, intrinsic dimensions, and visual
   treatment. Verify the resulting list against the files used by code.
3. Classify each asset by ownership:
   - **Component-owned:** the component's fixed visual vocabulary (for
     example, a finite named icon family). Bundle and map these explicitly.
   - **Consumer-provided:** an image, icon URL, or React node supplied through
     the public API. The component renders that value; the review example owns
     the fixture or import.
4. Implement a typed, centralized mapping for component-owned assets. The
   component selects by its public variant props rather than exposing file
   paths or relying on loosely constructed import paths. Cover every design
   variant; report a missing mapping instead of silently substituting a
   visually different asset.
5. Prefer one source asset plus an exact CSS filter only when the design
   source changes tone alone and the rendered color matches exactly. Keep
   separate assets when glyph, geometry, texture, crop, or other pixels differ.
6. Do not use temporary design-tool asset URLs in runtime source. Commit the
   exported bytes under the repository's established asset location, or use
   the project's existing matching asset. Never redraw an unavailable SVG by
   hand.
7. Add or update review examples for all component-owned types, sizes, and
   states needed for design review. Use Storybook when the project has it.
   Examples supply consumer-provided image fixtures through props; they do not
   cause the production component to import those fixtures.
8. Verify asset paths, all map keys, rendered intrinsic sizes, and state/tint
   behavior.

## Decision rules

- A name match is not proof that an existing icon is correct; compare its
  glyph and rendered dimensions to the design source.
- Export an icon with its square icon frame, never as the cropped inner
  glyph. Take the asset from the instance in the slot where the component
  uses it, at that instance's size, and center it; do not recreate the
  frame's padding with manual offsets.
- A design preview frame can demonstrate an asset but does not by itself add a
  fixed component width or height contract.
- Use canonical design tokens for any color that has one. When filtering is
  necessary, its effective color must equal the design value.
- Avoid loading an entire unrelated asset catalog to render one variant.
- Keep component asset maps close to the component and export only the public
  API that consumers need.

## Report

Report briefly in the user's language; otherwise use English. Include **only
actionable findings**:

- missing, incorrect, or unmapped component-owned variants;
- incorrect asset path, intrinsic/rendered dimension, state, tint, filter, or design-asset mismatch;
- consumer-provided content incorrectly bundled by the component, or component-owned assets incorrectly left to consumers;
- missing review-example coverage that prevents review of a component-owned variant, size, or state;
- missing design assets or ambiguous ownership that require a user decision.

Do not list assets, mappings, fixtures, or checks that are correct. If no
actionable findings exist, report only a concise equivalent of `No issues
found.` in the user's language.
