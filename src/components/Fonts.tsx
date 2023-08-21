import { Global } from '@emotion/react';

export const Fonts = () => (
  <Global
    styles={`
    @font-face {
      font-family: 'Libertad Mono';
      font-style: normal;
      font-weight: bold;
      font-display: swap;
      src: url('./fonts/LibertadMono-Bold.woff2') format('woff2'), url('./fonts/LibertadMono-Bold.woff') format('woff');
    }

    @font-face {
      font-family: 'Libertad Mono';
      font-style: normal;
      font-weight: medium;
      font-display: swap;
      src: url('./fonts/LibertadMono-Medium.woff2') format('woff2'), url('./fonts/LibertadMono-Medium.woff') format('woff');
    }

    @font-face {
      font-family: 'Libertad Mono';
      font-style: normal;
      font-weight: normal;
      font-display: swap;
      src: url('./fonts/LibertadMono-Regular.woff2') format('woff2'), url('./fonts/LibertadMono-Regular.woff') format('woff');
    }
    `}
  />
);
