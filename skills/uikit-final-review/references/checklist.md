# Final review checklist

- Verify that the task's main scenario was run end to end and works.

- Verify that the result was compared with the Figma design and the
  comparison passed.

- Verify that there are no console errors, no broken navigation, and no
  missing icons or other resources.

- Verify that no dead code remains: generated files, backup copies,
  commented-out code, debug output, or hardcoded values.

- Verify that tests for the change exist and pass in CI.

- Verify that the component follows the shared component implementation
  conventions: no hardcoded inline styles, own sizing constraints, state
  selectors that general selectors cannot override, `selected` without hover
  styling, transitions for designed state changes, the supported `ref` API,
  and Effect Events for latest values used by external systems.

- Verify that canonical tokens are used wherever Figma uses tokens.

- Verify that `calc()` expressions do not approximate a Figma value for which
  an exact token or literal exists.

- Verify asset ownership: component imports belong to its visual contract,
  and consumer-provided example images remain story fixtures.

- Verify that library-component instances in Figma correspond to the matching
  code components.

- Verify that review variants use the existing public API or interaction
  states, without Figma-only props added for stories.

- Verify that relevant project checks have recorded results and any limits.

- Verify that the reference-table update matches the final-review scope.
