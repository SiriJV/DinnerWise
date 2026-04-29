import type { Appearance } from '@clerk/types';

export const clerkAuthAppearance: Appearance = {
  layout: {
    socialButtonsPlacement: 'bottom',
  },
  elements: {
    card: {
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      border: 'none',
      width: '100%',
    },
    rootBox: {
      width: '100%',
    },
    formButtonPrimary: {
      backgroundColor: '#e71f4d',
      '&:hover': {
        backgroundColor: '#d3043b',
      },
    },
  },
};

export const clerkLoginOnlyAppearance: Appearance = {
  ...clerkAuthAppearance,
  elements: {
    ...clerkAuthAppearance.elements,
    footerAction: { display: 'none' },
  },
};
