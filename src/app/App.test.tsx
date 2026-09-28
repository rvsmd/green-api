import { render, screen } from '@testing-library/react';

describe('application shell', () => {
  it('renders a Russian heading', () => {
    render(<h1>MAX Чаты</h1>);

    expect(screen.getByRole('heading', { name: 'MAX Чаты' })).toBeInTheDocument();
  });
});
