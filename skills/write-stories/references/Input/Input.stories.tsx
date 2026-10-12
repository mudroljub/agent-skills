import { type CSSProperties, Fragment, useState } from 'react';
import { action } from 'storybook/actions';
import { useArgs } from 'storybook/preview-api';

import Input from './Input';

import type { InputProps } from './Input';

const InputPreview = (args: InputProps) => {
  const [, updateArgs] = useArgs();

  return (
    <div style={{ width: '270px' }}>
      <Input
        {...args}
        onChange={(value) => {
          updateArgs({ value });
          action('onChange')(value);
        }}
      />
    </div>
  );
};

export default {
  title: 'Inputs/Input',
  component: Input,
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    variant: { control: 'select', options: ['chatbox', 'searchbar'] },
    isDisabled: { control: 'boolean' },
    maxLength: { control: 'number' },
    className: { control: false, table: { disable: true } },
    onBlur: { control: false, table: { disable: true } },
    onChange: { control: false, table: { disable: true } },
    onFocus: { control: false, table: { disable: true } },
    onKeyDown: { control: false, table: { disable: true } },
  },
};

export const Input_ = {
  tags: ['!dev'],
  render: InputPreview,
  args: {
    value: '',
    label: 'Label text / Input text',
    variant: 'chatbox',
    isDisabled: false,
    maxLength: 100,
  },
};

const LABEL = 'Label text / Input text';

const VARIANTS = ['chatbox', 'searchbar'] as const;

const STATES = [
  { label: 'default', props: { value: '' } },
  { label: 'isDisabled=true', props: { value: '', isDisabled: true } },
  { label: 'value=Example text', props: { value: 'Example text' } },
];

const gridStyle: CSSProperties = {
  display: 'inline-grid',
  gridTemplateColumns: `max-content repeat(${VARIANTS.length}, 270px)`,
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

const InputItem = ({ value, ...props }: Pick<InputProps, 'variant' | 'value' | 'isDisabled'>) => {
  const [inputValue, setInputValue] = useState(value);

  return <Input {...props} value={inputValue} label={LABEL} onChange={setInputValue} />;
};

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
          <InputItem key={variant} variant={variant} {...props} />
        ))}
      </Fragment>
    ))}
  </div>
);
