import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import '@testing-library/jest-dom';

/**
 * Custom render function that includes providers
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything except render
export {
  screen,
  waitFor,
  within,
  fireEvent,
  act,
  cleanup,
  configure,
} from '@testing-library/react';
export type { RenderOptions } from '@testing-library/react';
export { customRender as render };
