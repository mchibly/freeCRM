import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Component: Button', () => {
  it('deve renderizar o botão com o texto correto', () => {
    render(<Button>Clique aqui</Button>);
    const buttonElement = screen.getByRole('button', { name: /clique aqui/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('deve chamar a função onClick quando clicado', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn(); // Cria um "mock" de função

    render(<Button onClick={handleClick}>Clique</Button>);
    const buttonElement = screen.getByText(/clique/i);

    await user.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('deve estar desabilitado quando a propriedade disabled for passada', () => {
    render(<Button disabled>Desabilitado</Button>);
    const buttonElement = screen.getByRole('button', { name: /desabilitado/i });
    expect(buttonElement).toBeDisabled();
  });
});