# Final review checklist

- Verify that components contain no hardcoded inline styles. A dynamic value
  received through a prop (for example, a user-supplied color) may be passed
  through `style`.

- Verify that canonical tokens are used wherever Figma uses tokens.

- Check `calc()` expressions in CSS files. When Figma provides a token, use it;
  otherwise, use the exact Figma literal rather than deriving a value from
  tokens.

- Verify that a component imports only images inseparable from its visual
  contract. Storybook stories must import all other images supplied through
  props.

- Verify whether the Figma component uses an existing UIKit atom. If so,
  compose that atom instead of recreating it with manual CSS.

- Fixed dimensions from a Figma preview frame belong to the Storybook wrapper,
  not the component. Transfer only explicitly defined `min/max-width` and
  `min/max-height` constraints to the component.

- Verify every Figma state. Disabled, focus, pressed, and open states must not
  be accidentally overridden by a more general selector.

- Verify that every visual state change defined by Figma has an appropriate CSS
  transition, including hover, pressed, focus, disabled, selected, and open
  states where applicable.

- In selector/dropdown atoms, the `selected` state must not receive hover
  styling; the hover selector must exclude `.selected`.

- Do not introduce a Figma-only prop (for example, `state`) merely to display a
  variant. Present review variants through the existing API, CSS states, or
  Storybook; some variants cannot be displayed without user interaction.

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

- Run the relevant checks: `yarn lint`, `yarn typecheck`, `yarn test`, and
  `yarn build`.

- Keep the `Unit Tests` cell in `REFERENCE_TABLE.md` aligned with the actual
  test state; do not change `Status`.
