---
name: write-stories
description: Create or revise React Storybook stories, Docs, and examples using the target project's established conventions. Use when adding or changing a component story; not for production component implementation.
---

# Write Stories

Create clear, reviewable Storybook stories without changing a component's public API merely to reproduce a design variant.

## Before editing

Read [the bundled Storybook conventions](references/conventions.md) and the
[approved local story patterns](references/project-patterns.md).

Inspect the project's `.storybook` configuration before adding stories. Reuse
existing decorators and mock state for components that depend on providers,
the router, APIs, or globals. Do not create divergent per-story setup when a
shared decorator is appropriate. If the required shared setup is absent,
report it or add it only when Storybook configuration is in scope.

Use a bundled reference extract only for its documented structure and
annotation treatment; its imports and public API belong to the source project
and may not apply to the target. Do not infer a convention from an arbitrary
comparable story: it can be an older or inconsistent implementation. If no
approved pattern applies, use the bundled fallback and state that the local
profile needs configuration.

## Docs and controls

- Follow the project's established Docs-page convention. Use the fallback in
  the bundled conventions only when the project has no established pattern.
- Put useful scalar public props in `args` and give them explicit controls in
  `argTypes`. Keep controls only for props with an observable result.
- Hide every prop a reader cannot try from the panel, both its control and its
  Docs table row: `{ control: false, table: { disable: true } }`. This covers
  callbacks, refs, `className`/`style`, ReactNode and slot props, fixture
  objects and arrays, router or store hooks, and props that change nothing
  visible in the story. Supply their fixed values in `args` or `render`. The
  Docs table lists only props that have a usable control.
- Add `Examples` or `Interactive` only when it aids design or state review.

## Examples layout

- When a design source exists, reproduce every relevant example that can be
  presented without user interaction. Preserve its structure and order,
  including icon or variant rows, state tables, headings, labels, text, and
  image assets.
- Assets used solely to compose one of those examples are story fixtures:
  import and map them in the story, not in the production component or its
  public API.
- Arrange the primary variant axis in column headers and states in rows when
  that makes comparison clearer.
- Give every column of a comparison grid the same width, sized to its widest
  header or example, and use the smallest gap that still keeps adjacent
  headers clearly separate. For example, use an `inline-grid` with
  `repeat(n, 1fr)` columns instead of content-sized columns.
- When every example varies along one shared public-prop axis, show the prop
  name once as a clear heading (for example, `State`) and label each example
  with only its value (for example, `hovered` or `disabled`). Do not repeat
  `state=` or another shared prop name under every item.
- Use the exact lowercase `prop=value` form, such as `type=chatbox` or
  `status=attention`, only for standalone annotations, mixed prop axes, or
  groups where the prop name is not already established by a shared heading.
- Keep annotations outside the component and match the project's existing
  annotation treatment.
- When examples are split into independently reviewable groups, give each
  group a visibly distinct section heading. For a public prop, keep the exact
  prop format (for example, `size=40`); do not reduce a section heading to a
  small row annotation.
- Use canonical component content in examples; annotations are review-only
  metadata, not component content.

## Preview sizing

When a design source requires a fixed presentation width, set it only on the
individual story that needs it. Do not set a global canvas width unless that
is the project's established convention.

## Component-family navigation

When related components share a Storybook navigation group, put the main or
root component first and arrange its child or supporting components after it
in a meaningful order. Do not add numeric prefixes or rename stories only to
force their order. If the default alphabetical order is unsuitable, use the
project's targeted Storybook sorting mechanism without changing unrelated
groups. Verify the resulting order in the generated Storybook index, not only
from the source titles.
