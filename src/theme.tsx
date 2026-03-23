// src/theme.ts
import { createTheme } from '@mantine/core';

export const theme = createTheme({
  cursorType: 'pointer',
  primaryColor: 'red',

  colors: {
    red: [
      '#ffe6ec',
      '#fbb3c4',
      '#f47f9c',
      '#ec4c74',
      '#e51f54',
      '#d90a47',
      '#d3043b', // 👈 EXAKT din färg
      '#b00332',
      '#8c0228',
      '#68011e',
    ],

    secondaryred: [
      '#ffe9e7',
      '#ffc6c1',
      '#ff9f96',
      '#ff776b',
      '#ff5141',
      '#e84132', // din red
      '#c83226',
      '#aa241b',
      '#8b170f',
      '#6d0a05',
    ],

    lightred: [
      '#fff5f4',
      '#ffe3e0',
      '#ffd6d1',
      '#ffc9c2',
      '#ffbdb3',
      '#ffccc7', // din lightred
      '#f5a39c',
      '#e07f76',
      '#c95c52',
      '#a63a31',
    ],

    darkred: [
      '#f2e8eb',
      '#d6bfc7',
      '#ba95a3',
      '#9e6c7f',
      '#864f66',
      '#74273e', // din darkred
      '#5f1f33',
      '#4a1728',
      '#35101d',
      '#200812',
    ],

    darkgreen: [
      '#edf2ed',
      '#cdd9cd',
      '#adc1ad',
      '#8da98d',
      '#6f936f',
      '#243821', // din darkgreen
      '#1e2e1c',
      '#182416',
      '#121b11',
      '#0c120b',
    ],

    darkblue: [
      '#e8eef2',
      '#c2d1de',
      '#9bb4ca',
      '#7597b6',
      '#507ca3',
      '#123347', // din darkblue
      '#0f2a3a',
      '#0c212d',
      '#091820',
      '#060f13',
    ],

    // neutrala / custom
    gray: [
      '#f8f9fa',
      '#f1f3f5',
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#868e96',
      '#495057',
      '#343a40',
      '#212529',
    ],
  },

  other: {
    lightred: 'rgba(255, 204, 199, 1)',
    lightgreen: 'rgba(216, 227, 222, 1)',
    lightblue: 'rgba(222, 222, 227, 1)',
    lightturquoise: 'rgba(189, 220, 216, 1)',
    darkgrey: 'rgba(134, 120, 113, 1)',
    lightgrey: 'rgba(222, 222, 227, 1)',
    lightbeige: 'rgba(218, 211, 204, 1)',
    yellow: 'rgba(255, 238, 186, 1)',
    darkyellow: 'rgba(120, 90, 10, 1)',
  },

  radius: {
    md: '0.8rem',
  },

  fontFamily: "'Open Sans', sans-serif",

  headings: {
    fontFamily: "'Open Sans', sans-serif",
  },
});
