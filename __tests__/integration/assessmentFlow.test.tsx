import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../../src/test-utils';
import App from '../../App';

describe('Assessment Flow Integration', () => {
  it('should navigate from hero to assessment', async () => {
    render(<App />);
    
    // Start with hero view
    expect(screen.getByText(/Learn What Your/i)).toBeInTheDocument();
    
    // Click quiz button
    const quizButton = screen.getByText(/Take the Quiz/i);
    quizButton.click();
    
    // Should show first question
    await waitFor(() => {
      expect(screen.getByText(/How has your energy been lately/i)).toBeInTheDocument();
    });
  });
});

