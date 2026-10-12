# Final review checklist

- Verify that components contain no hardcoded inline styles. A dynamic value
  received through a prop (for example, a user-supplied color) may be passed
  through `style`.

- Verify that canonical tokens are used wherever Figma uses tokens.

- Verify that `calc()` expressions do not approximate a Figma value for which
  an exact token or literal exists.

- Verify asset ownership: component imports belong to its visual contract,
  and consumer-provided example images remain story fixtures.

- Verify that library-component instances in Figma correspond to the matching
  code components.

- Verify that presentation-frame dimensions are confined to the preview and
  component dimensions follow explicit sizing constraints.

- Verify every Figma state. Disabled, focus, pressed, and open states must not
  be accidentally overridden by a more general selector.

- Verify that every visual state change defined by Figma has an appropriate CSS
  transition, including hover, pressed, focus, disabled, selected, and open
  states where applicable.

- In selector/dropdown atoms, the `selected` state must not receive hover
  styling; the hover selector must exclude `.selected`.

- Verify that review variants use the existing public API or interaction
  states, without Figma-only props added for stories.

- Verify React APIs against the project's supported React range. When the
  target supports `ref` as a function-component prop, expose and pass that
  prop directly instead of adding `forwardRef` or compatibility branches for
  older React versions the project no longer supports. Keep
  `useImperativeHandle` when the public API intentionally exposes an
  imperative handle.

- For listeners, subscriptions, timers, or other external systems installed by
  an Effect, use `useEffectEvent` for latest callback props or state that
  must not re-install that system. Keep genuine setup dependencies in the
  Effect dependency list; do not use an Effect Event to hide them, put it in
  that list, call it from render or a UI event handler, or pass it to another
  component. Replace manual "latest callback" refs when an Effect Event
  expresses the same intent.

- Verify that relevant project checks have recorded results and any limits.

- Verify that the reference-table update matches the final-review scope.
