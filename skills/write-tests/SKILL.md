---
name: write-tests
description: Write or improve behavioral unit and integration tests for React components using the configured test stack. Use when a component needs behavioral coverage; do not use for visual or end-to-end testing.
---

# Writing Tests

Write durable tests for the public behavior of React components. Cover both
isolated contracts and composed, user-observable behavior without testing CSS
pixels or implementation details.

## Before writing tests

1. Read the target component's public types, implementation, existing tests,
   directly composed atoms, and stories or usage examples.
2. Inspect the target project's package manifest and test setup when aliases,
   coverage, mocks, environment behavior, or test commands matter.
3. List the meaningful behavior axes: default values, public variants and
   sizes, interactive states, callbacks, keyboard/focus behavior, optional
   content, disabled behavior, and input/data edge cases.

Do not infer behavior from CSS alone. Use a design source only to identify a
state that must be exercised through the component's real public API.

## What to test

### Unit tests

Test an isolated public contract when it has behavior of its own:

- defaults, prop normalization, formatting, and callback payloads;
- every public variant, size, or asset-map key that changes rendered output;
- ref or imperative APIs when exported;
- disabled and unavailable behavior, including suppressed callbacks or sound.

### Integration tests

Render the real component composition when behavior crosses component
boundaries:

- a user interaction causing the expected visible result or callback;
- controlled value/state changes through a realistic parent harness when that
  state change is part of the contract;
- focus, keyboard navigation, open/close, selection, and dismissal flows;
- props, slots, and child atoms contributing to the rendered result.

Use the real composed atoms. Mock only external side effects such as
sound/game APIs, timers, or network boundaries; reset mocks between tests.

## Coverage design

Cover every meaningful public scenario, not every Cartesian product of props.
Test each independent axis on its own, then add representative combinations
where axes interact. Include empty or omitted optional content, long content,
and prior regressions when they can alter observable behavior.

Do not write tests solely for module class names, private state, component
internals, exact CSS declarations, pixel values, or Storybook-only labels.
Test semantic DOM output, accessible roles or labels where applicable, native
DOM state, and callbacks instead. Do not add behavior solely to satisfy a test
when it is absent from the component contract.

## Local test stack

- Derive the test runner, renderer, interaction utility, file placement, and
  focused-test command from the target project's package manifest, test setup,
  and the target component's test files. Do not treat unrelated existing tests
  as an implicit behavioral or mocking convention.
- Make fixtures small and explicit. Story fixtures do not substitute for tests.
- Keep tests deterministic: control timers, external modules, and random data.
- Do not add design-only props or production code merely to make a state easy
  to test. Drive it through the existing API or report that the public contract
  cannot express the required state.

## Verification and table boundary

Run the focused test command first, then the relevant broader checks when the
environment permits. Do not claim a skipped command passed. Do not run visual
end-to-end tests as part of this skill.

When the project tracks test status, read [the optional status target](references/project-testing.md).
After passing evidence exists, update only its configured field when it is no
longer truthful. Do not change other inventory fields or unrelated rows. If no
target is configured, do not create one.

## Report

Report briefly in the user's language; otherwise use English:

- unit and integration scenarios added or updated;
- meaningful axes and interaction flows covered;
- commands run and their result, or what could not be run;
- test-status update, if any;
- remaining untestable behavior or missing public API, if any.
