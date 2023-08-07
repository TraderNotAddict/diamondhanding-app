import { Global } from '@emotion/react';

export const Fonts = () => (
  <Global
    styles={`
    @font-face {
      font-family: 'Libertad Mono';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('./fonts/LibertadMono-Regular.woff2') format('woff2'), url('./fonts/LibertadMono-Regular.woff') format('woff');
    }
    `}
  />
);
