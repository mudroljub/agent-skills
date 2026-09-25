# Approved local story patterns

This is the project-specific part of `write-stories`. It records only story
examples that maintainers have explicitly approved as references. Do not add a
story merely because it is nearby or similar.

The retained files below are reference-only extracts. Their original imports
may not resolve because implementation, test, style, and asset files are
intentionally omitted. Read them for example structure and annotation
treatment; do not execute them or copy their project-specific imports.

## Approved reference extracts

- [`Button/Examples`](Button/Button.stories.tsx) is the approved reference for
  visual example layout, column and row hierarchy, and annotation treatment.
- [`Input/Examples`](Input/Input.stories.tsx) is the approved reference when
  annotations describe public prop values and states.

## Props and controls

Keep the Docs controls limited to props that a reader can meaningfully try and
observe in the story:

- Keep scalar visual props such as enums, booleans, text, and relevant numbers.
- Hide `children` when the story supplies fixture content or a composed slot.
- Hide callbacks such as `onChange`, `onClick`, `onConfirm`, and `onCancel`; use
  a fixed Storybook action or callback in the story instead.
- Hide styling and implementation hooks such as `className` and `style`. When
  the prop would otherwise appear in the Docs table, disable its table row as
  well: `className: { control: false, table: { disable: true } }`.
- Keep `children` as a text control only when changing the text is itself a
  useful part of the component review (for example, a selector label).

Do not remove fixture values required to render the component. This guidance
changes Storybook controls and documentation only; it does not change public
component APIs.

## Dropdown and menu preview sizing

For stories that open an absolute-positioned dropdown, give the Docs story
explicit vertical space and add simple padding around the trigger:

```tsx
parameters: {
  docs: {
    story: { height: '250px' },
  },
},
render: (args) => (
  <div style={{ padding: '40px' }}>
    <Component {...args} />
  </div>
),
```

Apply this to the individual dropdown story, not globally. Keep the wrapper
simple: do not force `width: 100%`, `minWidth`, or custom `overflow` unless the
component's own layout requires it. The padding keeps the menu away from the
canvas edges, while the story height prevents vertical clipping.

## Out-of-flow visual previews

Components rendered with `position: fixed` or `position: absolute` do not
contribute to the Storybook story's natural height. Give the individual Docs
story an explicit height and provide a matching, minimally styled wrapper so
the preview has stable space:

```tsx
parameters: {
  docs: {
    story: { height: '280px' },
  },
},
render: (args) => (
  <div style={{ minHeight: '280px' }}>
    <Component {...args} />
  </div>
),
```

Use this only for stories whose rendered component is out of normal flow. Do
not add a global story height or alter the production component just to make
its Storybook preview visible.

## Shared fixtures and providers

When several stories cover one component family, keep repeated fixture data in a
small, typed story-only module and import it from each story. Preserve meaningful
variants by deriving them from the shared fixture rather than copying a large
object literal. Do not move fixture data into production components or change a
public API only to support a story.

When the rendered component reads Redux, router, or another required context,
reuse an existing shared decorator when one exists. Otherwise provide the
smallest story-local provider/mock state needed for the component to render;
include non-empty fixture collections when the story is intended to review a
table or list rather than its empty state.

## Story discovery and index verification

Before adding a story outside the configured Storybook discovery pattern,
inspect the project's Storybook configuration (for example, a `.storybook/main.*`
file) and update discovery only when that configuration is within the requested
scope. After adding stories or changing discovery, verify the intended docs entry
in the project's generated story index (commonly `/index.json` or a static
index); a running dev server may retain an old index and require a restart before
newly added stories appear.
