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
`Status` column for pages. Give it a "Questions for later" section and a
"Lessons" section so a long run never has to stop for a decision.

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

Compare against the running app, not against a mental model of the code.

1. Open the page in a browser tool at the Figma frame size. Sign in the way the
   project does locally (ask the user how), and use an account whose data shows
   the designed state. Check that the route shows the designed variant (an
   "own" page and a "public" page can share a component but not a route).
2. Prefer a small scripted browser runner over interactive tool calls when the
   tool returns a page snapshot after every action: one script per state that
   signs in, reaches the state, and prints bounding boxes and computed styles
   for the blocks in question, plus clipped screenshots.
3. Reach states the local data cannot show with temporary hacks: flip a
   feature flag, skip a loading state, relax a route guard, or hardcode the
   Figma values straight into the markup. Ask first unless the user has agreed
   to hacks for the run. Keep a list of hacked files, never trigger real
   actions (save, leave, buy), and revert every hack right after the check;
   when real fixes land in the same file, revert the hack with a targeted edit
   instead of restoring a backup.
4. After a code change, wait until the dev build is newer than the changed
   sources (compare file times instead of sleeping) and confirm the new build
   is served before judging the result.

Ask before installing tools or browsers; never start long setups silently.

## 4. Compare and fix

1. For each visible block, find the Figma node and the React component that
   renders it. Prefer the design-system primitive Figma uses (a library button,
   dropdown, tab bar, or link button) over hand-made imitations, and remove
   overrides the current library version no longer reads.
2. Measure: positions, gaps, sizes, font size and weight, line height, color
   tokens, icon size, and alignment. Content differences count too, for example
   Figma showing a value without an extra suffix, or two sentences on separate
   lines.
3. Fix what Figma clearly specifies without asking. Record a question instead
   when Figma is silent, the sample data may lack a feature, frames of the same
   screen disagree (a width or padding that differs between instances), or the
   fix would need a new text string or a library change without a reference.
4. When the same element repeats across screens (for example a dropdown trigger
   with a down arrow), create one shared local component instead of repeating
   props and assets.
5. Before changing a shared component or stylesheet, list its other consumers
   and re-check them in the browser; keep a page-specific fix scoped (for
   example by a state class) when another consumer depends on the old layout.
6. Fix a rendering or behavior bug where it originates. If a library component
   breaks the layout, trace the CSS rule to its source, fix it in the library
   with a test and a changelog entry, and verify the effect in the browser
   before the user publishes a new version.
7. Take icons from the instance in the slot where Figma uses it, at that size
   and with the same crop. A raster icon in Figma stays raster; exporting it as
   SVG gains nothing.

## 5. Record and verify

1. Keep findings per page as a checklist. Check items off with a short note of
   what was done; do not delete them, because the plan is the record. Copy each
   open question to "Questions for later" and move on.
2. Update the component inventory (for example `docs/REFERENCE_TABLE.md`) for
   newly mapped or new components, with an in-progress status until the user
   confirms.
3. After each page run the linters and the affected tests; run the full
   verification (lint, types, tests, Storybook build) at the end and re-check
   the pages in the browser.
4. Mark the page done in the plan's `Status` column, noting open questions.
5. Write down what made the run slower or wrong in the plan's "Lessons"
   section, so the skill can be improved afterwards.

## Report

Report in the user's language. Name the pages covered, what changed, what was
verified in the browser, and the one next open item.
