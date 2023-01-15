import { render, screen } from './utils/test-utils';
import App from './App';

describe('App', () => {
  it('renders the app', () => {
    render(<App />);
    expect(screen.getByText('Cassidoo Template')).toBeVisible();
  });
});
