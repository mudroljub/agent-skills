---
name: match-page
description: Compare whole app pages with their Figma screen designs and fix the differences, one page at a time. Use when the user asks to review, compare, or align app pages, screens, or layouts with Figma, to map which pages have a design, or to continue a page review plan.
compatibility: Requires repository access, inspectable Figma design context, and a browser tool (for example Playwright MCP) that can open the running app. For an app that renders only inside an embedded engine, a browser preview that stubs the engine API serves as the running app; without one, the project's in-engine instructions replace the browser tool.
---

# Page Review Against Figma

A page is a composition: layout, spacing between blocks, and which components
appear. Component internals are out of scope; this skill checks how the
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
5. Order the plan by the user's priority.

Keep the plan where the project keeps internal working documents, and add one
`Status` column and a "Lessons" section for observations about the review
process.

## 2. Read Figma economically

Large screens are expensive to inspect; spend tokens on the nodes you compare.

1. Screenshot the whole frame first, then call metadata once to get the child
   ids. A full-screen frame often repeats shared chrome (headers, menus), so
   do not repeat that call.
2. Call design context on the content node only. Never call it on a container
   that repeats a component many times (a list panel): fetch one instance and
   read the container's own fill, padding, and gaps separately.
3. Instance sublayer ids cannot be screenshotted; download the assets of the
   parent instance instead to get the source image.
4. Look at every overlay in a frame (tooltips, menus, dropdowns), not only the
   state the frame is named after.
5. Note the vertical rhythm. Screens are usually built from one repeated gap
   (for example 24px between every block and divider); implementing the rhythm
   fixes many measurements at once.

## 3. Look at the real page

1. Open the page in a browser tool at the Figma frame size. Use the project's
   local sign-in flow and an account whose data shows the designed state.
   Check that the route shows the designed variant (an
   "own" page and a "public" page can share a component but not a route).
2. Prefer a small scripted browser runner over interactive tool calls when the
   tool returns a page snapshot after every action: one script per state that
   signs in, reaches the state, and prints bounding boxes and computed styles
   for the blocks in question, plus clipped screenshots. For a page that
   needs no sign-in, [the measuring script](scripts/measure-page.mjs) opens a
   URL in headless Chrome at an exact viewport, saves a screenshot, and prints
   the value of a JavaScript expression; measure bounding boxes through that
   expression instead of judging the screenshot by eye. It waits in real time
   because Chrome's `--virtual-time-budget` does not run
   `requestAnimationFrame`, so layout computed in a frame callback never
   appears. The first load after a dev server starts can outlast the wait
   while dependencies are optimised, so a blank first capture means wait
   longer and retry, not a broken page.
3. A state the local data cannot show can be reached with a temporary hack:
   flip a feature flag, skip a loading state, relax a route guard, or hardcode
   the Figma values straight into the markup. Keep a list of hacked files, never
   trigger real actions (save, leave, buy), and revert every hack right after the check;
   when real fixes land in the same file, revert the hack with a targeted edit
   instead of restoring a backup.
4. After a code change, wait until the dev build is newer than the changed
   sources (compare file times instead of sleeping) and confirm the new build
   is served before judging the result.

## 4. Compare and fix

1. For each visible block, find the Figma node and the React component that
   renders it. Verify that library-component instances in Figma correspond to
   the matching code components. Remove overrides the current library version
   no longer reads.
2. Measure: positions, gaps, sizes, font size and weight, line height, color
   tokens, icon size, and alignment. Content differences count too, for example
   Figma showing a value without an extra suffix, or two sentences on separate
   lines.
3. Fix confirmed differences. Record missing sample-data features or new text
   strings as verification limits.
4. Verify that shared elements across screens (for example dropdown triggers)
   use consistent props and assets.
5. Before changing a shared component or stylesheet, list its other consumers
   and re-check them in the browser; keep a page-specific fix scoped (for
   example by a state class) when another consumer depends on the old layout.
6. If a library component breaks the layout, trace the CSS rule to its
   source, fix it in the library with a test and a changelog entry, and verify
   the effect in the browser before the user publishes a new version.
7. Check animated changes (a panel sliding in, a menu opening) frame by frame
   against the element they move with, not only the start and end positions;
   an element that travels outside its panel during the animation looks
   broken even when both end states are right.
8. When a fix keeps fighting the current structure (one element playing two
   roles, positions computed across unrelated containers), look up which Figma
   parent owns each element and move it there instead of patching the CSS.

## 5. Record and verify

1. Record measured differences and their evidence per page in the plan.
2. Update the component inventory (for example `docs/REFERENCE_TABLE.md`) for
   newly mapped or new components.
3. After each page run the linters and the affected tests; run the full
   verification (lint, types, tests, Storybook build) at the end and re-check
   the pages in the browser.
4. Present the page in the browser for visual review alongside the measured
   checks: a human sees differences that measurements miss.
5. Write down what made the run slower or wrong in the plan's "Lessons"
   section, so the skill can be improved afterwards.

## Report

The record is the plan (differences, evidence, status, and lessons per page)
and the component inventory. The user must be told the pages covered, what
changed, what was verified in the browser, and any verification limits.
