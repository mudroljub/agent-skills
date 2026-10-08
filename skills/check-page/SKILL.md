---
name: check-page
description: Compare whole app pages with their Figma screen designs and fix the differences, one page at a time. Use when the user asks to review, compare, or align app pages, screens, or layouts with Figma, to map which pages have a design, or to continue a page review plan; for a single component's pixel audit, use check-design.
compatibility: Requires repository access, inspectable Figma design context, and a browser tool (for example Playwright MCP) that can open the running app.
---

# Page Review Against Figma

A page is a composition: layout, spacing between blocks, and which components
appear. Component internals belong to `check-design`; this skill checks how the
page puts them together and fixes what Figma clearly specifies.

## 1. Map the screens first

1. List the Figma pages and their top-level screen frames (for example
   1920×1080 frames inside sections). Treat draft or reference pages as out of
   scope unless the user says otherwise.
2. Identify every screen from its rendered image, not from layer names or
   extracted text. Frames often keep stale names ("Home default") and hidden
   layers whose text belongs to another screen.
3. Read the state labels designers place next to frames (for example "hover
   state", "empty state") and attach each to the nearest frame below or beside it.
4. Write a plan document with one row per Figma screen: app page and route,
   state shown, link to the node. List pages without a final design separately.
5. Order the plan by the user's priority; ask only if none is given.

Keep the plan where the project keeps internal working documents, and add a
`Status` column for pages.

## 2. Look at the real page

Compare against the running app, not against a mental model of the code.

1. Open the page in a browser tool at the Figma frame size. Sign in the way the
   project does locally (ask the user how), and use an account whose data shows
   the designed state.
2. Take a screenshot and read computed styles and bounding boxes for the blocks
   in question (`getBoundingClientRect`, `getComputedStyle`).
3. If a needed state cannot be reproduced with real data, a temporary local
   hack is acceptable only with the user's consent; back up the file and revert
   it right after the check.
4. After a code change, confirm the new build is served (bundle timestamp, or a
   cache-busted stylesheet) before judging the result.

Ask before installing tools or browsers; never start long setups silently.

## 3. Compare and fix

1. For each visible block, find the Figma node and the React component that
   renders it. Prefer the design-system primitive Figma uses (a library button,
   dropdown, or tab) over hand-made imitations.
2. Measure: positions, gaps, sizes, font size and weight, line height, color
   tokens, icon size, and alignment. Content differences count too, for example
   Figma showing a value without an extra suffix.
3. Fix what Figma clearly specifies without asking. When Figma is silent or the
   sample data may simply lack a feature (an empty badge, a missing rank),
   keep the current behavior and record a question for the designer.
4. When the same element repeats across screens (for example a dropdown trigger
   with a down arrow), create one shared local component instead of repeating
   props and assets.
5. Fix a rendering bug where it originates. If a library component breaks the
   layout, trace the CSS rule to its source, fix it in the library with a test
   and a changelog entry, and verify the effect in the browser before the user
   publishes a new version.
6. Take icons from the instance in the slot where Figma uses it, at that size.
   A raster icon in Figma stays raster; exporting it as SVG gains nothing.

## 4. Record and verify

1. Keep findings per page as a checklist. Check items off with a short note of
   what was done; do not delete them, because the plan is the record.
2. Update the component inventory (for example `docs/REFERENCE_TABLE.md`) for
   newly mapped or new components, with an in-progress status until the user
   confirms.
3. Run the project's full verification (lint, types, tests, Storybook build)
   and re-check the page in the browser.
4. Mark the page done in the plan's `Status` column, noting open designer
   questions.

## Report

Report in the user's language. Name the page, what changed, what was verified in
the browser, and the one next open item.
