import { type CSSProperties, useState } from 'react';
import { action } from 'storybook/actions';
import { useArgs } from 'storybook/preview-api';

import Input from './Input';

import type { InputProps } from './Input';

const InputPreview = (args: Pick<InputProps, 'value' | 'variant' | 'label' | 'isDisabled' | 'maxLength'>) => {
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
  parameters: {
    controls: {
      include: ['value', 'label', 'variant', 'isDisabled', 'maxLength'],
    },
  },
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    variant: { control: 'select', options: ['chatbox', 'searchbar'] },
    isDisabled: { control: 'boolean' },
    maxLength: { control: 'number' },
    className: { control: false },
    onBlur: { control: false },
    onChange: { control: false },
    onFocus: { control: false },
    onKeyDown: { control: false },
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

const PLACEHOLDER_TEXT = 'Label text / Input text';
const EXAMPLE_VALUE = 'Example text';

const rowStyle: CSSProperties = {
  display: 'flex',
  gap: '40px',
  alignItems: 'flex-start',
  marginBottom: '15px',
};

const labelStyle: CSSProperties = {
  color: 'rgba(255,255,255,0.3)',
  fontSize: '10px',
  marginBottom: '5px',
};

const variantLabelStyle: CSSProperties = {
  color: 'rgba(255,255,255,0.4)',
  fontSize: '10px',
  marginBottom: '5px',
  textTransform: 'uppercase',
  fontWeight: 'bold',
};

type InputItemProps = {
  variant: 'chatbox' | 'searchbar';
  value: string;
  isDisabled?: boolean;
};

const InputItem = ({ variant, value, isDisabled }: InputItemProps) => {
  const [inputValue, setInputValue] = useState(value);

  return (
    <div style={{ minWidth: '270px' }}>
      <Input
        value={inputValue}
        variant={variant}
        label={PLACEHOLDER_TEXT}
        isDisabled={isDisabled}
        onChange={setInputValue}
      />
    </div>
  );
};

export const Examples = () => {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
        <div style={{ ...variantLabelStyle, width: '270px' }}>type=chatbox</div>
        <div style={{ ...variantLabelStyle, width: '270px' }}>type=searchbar</div>
      </div>

      <div style={labelStyle}>state=default</div>
      <div style={rowStyle}>
        <InputItem variant="chatbox" value="" />
        <InputItem variant="searchbar" value="" />
      </div>

      <div style={labelStyle}>state=disabled</div>
      <div style={rowStyle}>
        <InputItem variant="chatbox" value="" isDisabled />
        <InputItem variant="searchbar" value="" isDisabled />
      </div>

      <div style={labelStyle}>state=text inside</div>
      <div style={rowStyle}>
        <InputItem variant="chatbox" value={EXAMPLE_VALUE} />
        <InputItem variant="searchbar" value={EXAMPLE_VALUE} />
      </div>
    </div>
  );
};
