import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#131315',
        color: 'white',
        fontFamily: `'Libertad Mono', monospace`,
      },
    },
  },
  fontSizes: {
    '2xs': '0.45rem',
    xs: '0.625rem',
    sm: '0.755rem',
    md: '0.875rem',
    lg: '1rem',
    xl: '1.125rem',
    '2xl': '1.25rem',
    '3xl': '1.5rem',
    '4xl': '1.875rem',
    '5xl': '2rem',
    '6xl': '3rem',
    '7xl': '3.75rem',
    '8xl': '4.5rem',
    '9xl': '6rem',
  },
});

export default theme;
