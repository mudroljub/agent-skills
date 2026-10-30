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
  a comparison grid: equal columns per variant, states in rows, the shared
  heading shown once, and fully hidden non-interactive props.
- [`Input/Examples`](Input/Input.stories.tsx) is the approved reference when
  annotations describe public prop values (`variant=…`, `isDisabled=true`).

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

Include non-empty fixture collections when the story is intended to review a
table or list rather than its empty state. Context-dependent stories follow
the [entrypoint's setup rules](../SKILL.md#before-editing).

## Story discovery and index verification

Before adding a story outside the configured Storybook discovery pattern,
inspect the project's Storybook configuration (for example, a `.storybook/main.*`
file) and update discovery only when that configuration is within the requested
scope. After adding stories or changing discovery, verify the intended docs entry
in the project's generated story index (commonly `/index.json` or a static
index); a running dev server may retain an old index and require a restart before
newly added stories appear.
