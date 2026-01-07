// src/theme.ts
import { createTheme } from '@mantine/core';

export const theme = createTheme({
  colors: {
    primaryred: [
      '#ffe5ea',
      '#fbb3c2',
      '#f3809a',
      '#ec4d72',
      '#e71f4d',
      '#d3043b', // ← $primaryred
      '#b00032',
      '#8c0027',
      '#68001c',
      '#450011',
    ],

    darkred: [
      '#f2e8eb',
      '#d6bfc7',
      '#ba95a3',
      '#9e6c7f',
      '#864f66',
      '#74273e', // ← $darkred
      '#5f1f33',
      '#4a1728',
      '#35101d',
      '#200812',
    ],

    red: [
      '#ffe9e7',
      '#ffc6c1',
      '#ff9f96',
      '#ff776b',
      '#ff5141',
      '#e84132', // ← $red
      '#c83226',
      '#aa241b',
      '#8b170f',
      '#6d0a05',
    ],

    darkgreen: [
      '#edf2ed',
      '#cdd9cd',
      '#adc1ad',
      '#8da98d',
      '#6f936f',
      '#243821', // ← $darkgreen
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
      '#123347', // ← $darkblue
      '#0f2a3a',
      '#0c212d',
      '#091820',
      '#060f13',
    ],

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

  primaryColor: 'primaryred',

  radius: {
    md: '0.8rem',
  },

  fontFamily: "'Mixone', 'Georgia', 'Times New Roman', serif",
});
