---
name: write-components
description: Implement or change React UI-library components following shared implementation conventions for styling, interaction states, sizing, refs, and effects. Use whenever component source code is written, refactored, or fixed, including fixes found by a design or readiness review; do not use for stories, tests, design measurement, assets, or design tokens.
---

# Write Components

Write component code whose styling, states, and React API stay predictable for
every consumer, so later reviews find nothing to correct.

## Styling

- Keep styles in the component's stylesheet. Pass a value through `style` only
  when it arrives through a prop at runtime, such as a user-supplied colour,
  because inline literals escape tokens, themes, and state selectors.
- Size the component by its own constraints (`min`/`max` width and height, or
  a fixed size the design gives it). Dimensions of a preview or presentation
  frame belong to the preview, not to the component.

## Interaction states

- Give every state the design defines (disabled, focus, pressed, selected,
  open) a selector that a more general selector cannot override; check the
  cascade order and specificity, not only the rule itself.
- In selector and dropdown items, keep the `selected` look under the pointer:
  write the `.selected` rule after the `:hover` rule with at least the same
  specificity, which works in every renderer, including those without
  `:not()`.
- Animate every visual state change the design defines with a CSS transition
  on the properties that change, using the design's timing.

## React API

- Follow the React version the project supports. When function components
  receive `ref` as a prop, accept and pass it directly instead of adding
  `forwardRef` or branches for older versions. Keep `useImperativeHandle`
  only when the public API intentionally exposes an imperative handle.
- For listeners, subscriptions, timers, or other external systems an Effect
  installs, read the latest callback props or state through `useEffectEvent`,
  so the system is not reinstalled on every change. Keep real setup
  dependencies in the Effect's dependency list, never list the Effect Event
  there, never call it during render or from a UI event handler, and never
  pass it to another component. Replace manual "latest callback" refs with it.

## Report

The record is the changed component files. Tell the user what changed and any
convention the project's API or design could not satisfy.
