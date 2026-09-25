import { type CSSProperties, Fragment } from 'react';
import { action } from 'storybook/actions';

import arrowOutPng from './assets/arrow-out.png';
import notificationPng from './assets/notification.png';
import Button from './Button';

export default {
  title: 'Inputs/Button',
  component: Button,
  parameters: {
    controls: {
      include: ['variant', 'size', 'isFocused', 'isDisabled', 'label'],
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'accent'] },
    size: { control: 'select', options: ['xs', 's', 'm', 'l', 'icon'] },
    isFocused: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    label: { control: 'text' },
    className: { control: false },
    iconPosition: { control: false },
    iconSrc: { control: false },
    onClick: { control: false },
    onMouseEnter: { control: false },
    onMouseLeave: { control: false },
    onMouseOut: { control: false },
    onMouseOver: { control: false },
    tabIndex: { control: false },
  },
};
export const Button_ = {
  tags: ['!dev'],
  render: (args: any) => (
    <Button
      variant={args.variant}
      size={args.size}
      isFocused={args.isFocused}
      isDisabled={args.isDisabled}
      label={args.label}
      onClick={action('onClick')}
    />
  ),
  args: {
    variant: 'primary',
    size: 'm',
    isFocused: false,
    isDisabled: false,
    label: 'Click me',
  },
};

const BUTTON_TEXT = 'TEXT';

const rowStyle: CSSProperties = {
  display: 'flex',
  gap: '40px',
  alignItems: 'flex-start',
  marginBottom: '15px',
};

const groupStyle: CSSProperties = {
  display: 'flex',
  gap: '10px',
  alignItems: 'flex-start',
};

const labelStyle: CSSProperties = {
  color: 'rgba(255,255,255,0.3)',
  fontSize: '10px',
  marginBottom: '5px',
};

const variantLabelStyle: CSSProperties = {
  color: 'rgba(255,255,255,0.4)',
  fontSize: '11px',
  marginBottom: '5px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

type ButtonGroupProps = {
  variant: 'primary' | 'secondary' | 'accent';
  isFocused?: boolean;
  isDisabled?: boolean;
};

const ButtonGroup = ({ variant, isFocused, isDisabled }: ButtonGroupProps) => (
  <div style={groupStyle}>
    <Button
      variant={variant}
      size="l"
      label={BUTTON_TEXT}
      iconSrc={arrowOutPng}
      isFocused={isFocused}
      isDisabled={isDisabled}
    />
    <Button
      variant={variant}
      size="m"
      label={BUTTON_TEXT}
      iconSrc={arrowOutPng}
      isFocused={isFocused}
      isDisabled={isDisabled}
    />
    <Button
      variant={variant}
      size="s"
      label={BUTTON_TEXT}
      iconSrc={arrowOutPng}
      isFocused={isFocused}
      isDisabled={isDisabled}
    />
    {variant !== 'accent' && (
      <Button variant={variant} size="icon" iconSrc={notificationPng} isFocused={isFocused} isDisabled={isDisabled} />
    )}
  </div>
);

export const Examples = () => {
  const states = [
    { label: 'Default', props: {} },
    { label: 'Focused (Glowing)', props: { isFocused: true } },
    { label: 'Disabled', props: { isDisabled: true } },
  ];

  return (
    <div style={{ padding: '20px', minHeight: '600px' }}>
      <div style={{ display: 'flex', gap: '40px', marginBottom: '10px' }}>
        <div style={{ ...variantLabelStyle, width: 'calc(103px + 99px + 95px + 24px + 30px)' }}>Primary</div>
        <div style={{ ...variantLabelStyle, width: 'calc(103px + 99px + 95px + 24px + 30px)' }}>Secondary</div>
        <div style={{ ...variantLabelStyle, width: 'calc(103px + 99px + 95px + 20px)' }}>Accent</div>
      </div>
      {states.map(({ label, props }) => (
        <Fragment key={label}>
          <div style={labelStyle}>{label}</div>
          <div style={rowStyle}>
            <ButtonGroup variant="primary" {...props} />
            <ButtonGroup variant="secondary" {...props} />
            <ButtonGroup variant="accent" {...props} />
          </div>
        </Fragment>
      ))}
    </div>
  );
};
