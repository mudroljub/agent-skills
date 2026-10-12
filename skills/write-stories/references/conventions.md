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

Apply the [entrypoint's Docs and controls rules](../SKILL.md#docs-and-controls)
to the fallback below.

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

## Out-of-flow previews

Use the [dropdown and out-of-flow sizing patterns](project-patterns.md#dropdown-and-menu-preview-sizing)
for components whose rendered content falls outside normal flow.

## Examples annotation labels

An approved local pattern may define the structural layout. Otherwise use a
short heading, a contained example, then annotation labels beneath it. Apply
the [entrypoint's annotation rules](../SKILL.md#examples-layout); otherwise keep
the visual treatment restrained and consistent within the story.

## Preview width

When a design source shows a fixed frame width only as a presentation example,
apply that width to the Storybook preview wrapper. Keep the component itself
flexible unless the component contract explicitly defines a fixed, minimum, or
maximum width.

Set presentation widths per story. Use a global canvas width only when that
is the project's established convention.

```tsx
<div style={{ width: '360px' }}>
  <ComponentName />
</div>
```
