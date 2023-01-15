import * as React from 'react';
import { render, screen, userEvent } from '../utils/test-utils';
import { Input } from './Input';

describe('Input', () => {
  const INPUT_LABEL = 'my label';
  const Component = () => {
    const [value, setValue] = React.useState('');

    return <Input label={INPUT_LABEL} value={value} setValue={setValue} />;
  };

  it('renders the input', () => {
    render(<Component />);

    expect(screen.getByText(INPUT_LABEL)).toBeVisible();
  });

  it('updates the input as the user types', async () => {
    const user = userEvent.setup();
    render(<Component />);

    const input = screen.getByLabelText(INPUT_LABEL);

    await user.type(input, 'hello');

    expect(input).toHaveValue('hello');
  });
});
