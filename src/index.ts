import { Jevalide } from './validation/jevalide';

declare global {
  interface Window {
    Jevalide: typeof Jevalide;
  }
}

if (typeof window !== 'undefined') {
  window.Jevalide = window.Jevalide ?? Jevalide;
}

export { Jevalide };
