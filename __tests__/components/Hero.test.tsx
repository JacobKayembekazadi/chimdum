import { describe, it, expect, vi } from 'vitest';

import Hero from '../../components/Hero';
import { render, screen } from '../../src/test-utils';

describe('Hero', () => {
  it('should render hero content', () => {
    const onStartText = vi.fn();

    render(<Hero onStartText={onStartText} />);

    expect(screen.getByText(/Learn What Your/i)).toBeInTheDocument();
    expect(screen.getByText(/Take the Quiz/i)).toBeInTheDocument();
  });

  it('should call onStartText when quiz button is clicked', () => {
    const onStartText = vi.fn();

    render(<Hero onStartText={onStartText} />);

    const quizButton = screen.getByText(/Take the Quiz/i);
    quizButton.click();

    expect(onStartText).toHaveBeenCalledTimes(1);
  });
});
