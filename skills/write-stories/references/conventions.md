# Storybook conventions

Use the approved local patterns when they are available. The rules below are
the reusable fallback; do not treat an arbitrary existing story as a
convention.

- Before creating Docs stories, verify that the project enables Docs and
  Autodocs. A hidden `ComponentName_` story alone does not generate a Docs
  page. Reuse a global `autodocs` tag when present; otherwise add
  `tags: ['autodocs']` to the component meta only when Docs configuration is
  in scope.
- When a component needs a generated Docs page, create a hidden story named
  `<ComponentName>_`. When the installed Storybook version supports it, tag it
  with `!dev`; otherwise use the project's existing way to hide a Docs-only
  story.
- Pass useful scalar public props through `args` and define their controls explicitly in `argTypes`. Hide every prop that cannot be meaningfully tried from the panel, including its Docs table row.
- Keep review stories such as `Examples`, `AllVariants`, or `Interactive` only
  when useful for design or state review.
- Do not add production component props only to reproduce design variants.
  Reuse the existing API, native interaction states, or Storybook mechanisms
  instead.

## Props/Controls story

Use this fallback pattern when the component should appear in Docs with a
Props/Controls section, including pure visual composites:

```tsx
import type { Meta, StoryObj } from '@storybook/your-framework';

import ComponentName from './ComponentName';

const meta = {
  title: 'Category/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    className: { control: false, table: { disable: true } },
    children: { control: false, table: { disable: true } },
    onClick: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ComponentName_: Story = {
  tags: ['!dev'],
  render: (args) => <ComponentName {...args} />,
  args: {
    title: 'Default title',
  },
};
```

- `args` provide the default values shown in Docs; `argTypes` define the available controls.
- Use `{ control: false, table: { disable: true } }` for callbacks, `className`, `children` and other ReactNode/slot props, fixture objects and refs when they cannot be usefully tried from the panel. Provide their fixed composition in `args` or `render`. The Docs table shows only props with a usable control.
- Keep a control only when a story reader can change it and observe a meaningful result. Do not expose implementation hooks such as `className` merely because Storybook inferred them.
- Add `Examples` when a separate visual comparison of multiple design
  variants, states, or usage cases is required.
- For components that require application context, use the shared preview
  decorator or mock state; keep fixture data in the story and avoid changing
  the production component API.
- When stories are moved or renamed, confirm that Docs and the intended visible
  stories appear in Storybook navigation.

## Open dropdown previews

An open menu or select can render outside the component's normal flow. When
its Docs story is clipped, give only that story an explicit preview height:

```tsx
parameters: {
  docs: {
    story: { height: '250px' },
  },
},
```

Do not turn this into a global layout default.

## Examples annotation labels

An approved local pattern may define the structural layout. Otherwise use a
short heading, a contained example, then annotation labels beneath it. When
labels document public API semantics, use the exact lowercase prop name and
add a concise value note only if that improves the API explanation.

Keep annotation labels outside the rendered component. Follow an approved
local pattern when one specifies annotation styling; otherwise keep the
treatment restrained and consistent within the story. Do not invent a new
annotation system for one component.

## Preview width

When a design source shows a fixed frame width only as a presentation example,
apply that width to the Storybook preview wrapper. Keep the component itself
flexible unless the component contract explicitly defines a fixed, minimum, or
maximum width.

```tsx
<div style={{ width: '360px' }}>
  <ComponentName />
</div>
```
