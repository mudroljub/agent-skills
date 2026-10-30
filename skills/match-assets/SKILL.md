---
name: match-assets
description: Audit, fix, or implement component assets from a design source, especially icon or image variants, sizes, states, tinting, and review examples. Use whenever a component imports, maps, exports, replaces, or displays visual assets; do not use for general visual CSS parity without asset work.
---

# Match Assets

Keep asset ownership, variant mapping, and rendering faithful to the design
source without turning consumer-provided content into bundled component assets.

## Scope

Use this skill for component-owned icons, illustrations, textures, and their
named design variants. It is not a substitute for a full CSS parity review.

An audit and an implementation follow the same workflow and fix asset
mismatches within the component. An ambiguous design source,
consumer-provided content, and changes outside the component are left to the
user.

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
4. Create or update a typed, centralized mapping for component-owned assets.
   The component selects by its public variant props rather than exposing file
   paths or relying on loosely constructed import paths. Cover every design
   variant; never substitute a visually different asset for a missing one.
5. Prefer one source asset plus an exact CSS filter only when the design
   source changes tone alone and the rendered color matches exactly. Keep
   separate assets when glyph, geometry, texture, crop, or other pixels differ.
6. Replace temporary design-tool asset URLs in runtime source with the
   exported bytes under the repository's established asset location, or with
   the project's existing matching asset. Never redraw an unavailable SVG by
   hand.
7. Add or update review examples for all component-owned types, sizes, and
   states needed for design review, in the project's story format.
8. Verify asset paths, all map keys, rendered intrinsic sizes, and state/tint
   behavior.

## Decision rules

- A name match is not proof that an existing icon is correct; compare its
  glyph and rendered dimensions to the design source.
- Export icons with a square icon frame by default, never cropped to the
  inner glyph. Use a non-square frame only for an explicitly documented design
  exception; the glyph's shape alone does not establish an exception. Take the
  asset from the instance in the slot where the component uses it, at that
  instance's size. Preserve its padding and glyph alignment without stretching
  the glyph or recreating the frame's padding with manual offsets.
- A raster icon in Figma stays raster; exporting it as SVG gains nothing.
- Use canonical design tokens for any color that has one. When filtering is
  necessary, its effective color must equal the design value.
- Avoid loading an entire unrelated asset catalog to render one variant.
- Keep component asset maps close to the component and export only the public
  API that consumers need.

## Report

The record is the changed asset, source, and review-example files. Tell the
user the variants, mappings, paths, dimensions, states, tints, and review
examples that were changed, and the items left to the user: missing design
assets, ambiguous design sources or ownership, consumer-provided content
bundled by the component, and changes outside the component. Leave out assets,
mappings, fixtures, and checks that are correct; when nothing changed and
nothing is left to the user, the only fact to tell is that no issues were
found.
