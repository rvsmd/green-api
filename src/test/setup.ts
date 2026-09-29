import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'node:util';

Object.assign(global, { TextDecoder, TextEncoder });

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({ matches: false }),
});

Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
  configurable: true,
  value: jest.fn(),
});
