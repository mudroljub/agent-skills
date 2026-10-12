import { type CSSProperties, Fragment } from 'react';
import { action } from 'storybook/actions';

import arrowOutPng from './assets/arrow-out.png';
import notificationPng from './assets/notification.png';
import Button from './Button';

import type { ButtonProps } from './Button';

export default {
  title: 'Inputs/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'accent'] },
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'icon'] },
    isFocused: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    label: { control: 'text' },
    className: { control: false, table: { disable: true } },
    iconPosition: { control: false, table: { disable: true } },
    iconSrc: { control: false, table: { disable: true } },
    onClick: { control: false, table: { disable: true } },
    onMouseEnter: { control: false, table: { disable: true } },
    onMouseLeave: { control: false, table: { disable: true } },
    onMouseOut: { control: false, table: { disable: true } },
    onMouseOver: { control: false, table: { disable: true } },
    tabIndex: { control: false, table: { disable: true } },
  },
};

export const Button_ = {
  tags: ['!dev'],
  render: (args: ButtonProps) => <Button {...args} onClick={action('onClick')} />,
  args: {
    variant: 'primary',
    size: 'm',
    isFocused: false,
    isDisabled: false,
    label: 'Click me',
  },
};

const VARIANTS = ['primary', 'secondary', 'accent'] as const;

const STATES = [
  { label: 'default', props: {} },
  { label: 'isFocused=true', props: { isFocused: true } },
  { label: 'isDisabled=true', props: { isDisabled: true } },
];

const gridStyle: CSSProperties = {
  display: 'inline-grid',
  gridTemplateColumns: `max-content repeat(${VARIANTS.length}, 1fr)`,
  gap: '16px 24px',
  alignItems: 'center',
};

const headingStyle: CSSProperties = {
  color: 'rgba(255,255,255,0.6)',
  fontSize: '12px',
};

const annotationStyle: CSSProperties = {
  color: 'rgba(255,255,255,0.4)',
  fontSize: '11px',
};

const rowStyle: CSSProperties = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
};

const ButtonRow = ({ variant, ...state }: Pick<ButtonProps, 'variant' | 'isFocused' | 'isDisabled'>) => (
  <div style={rowStyle}>
    {(['l', 'm', 's'] as const).map((size) => (
      <Button key={size} variant={variant} size={size} label="TEXT" iconSrc={arrowOutPng} {...state} />
    ))}
    {variant !== 'accent' && <Button variant={variant} size="icon" iconSrc={notificationPng} {...state} />}
  </div>
);

export const Examples = () => (
  <div style={gridStyle}>
    <div style={headingStyle}>State</div>
    {VARIANTS.map((variant) => (
      <div key={variant} style={headingStyle}>
        variant={variant}
      </div>
    ))}
    {STATES.map(({ label, props }) => (
      <Fragment key={label}>
        <div style={annotationStyle}>{label}</div>
        {VARIANTS.map((variant) => (
          <ButtonRow key={variant} variant={variant} {...props} />
        ))}
      </Fragment>
    ))}
  </div>
);
