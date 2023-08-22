export const getBackgroundColor = (symbol: string) => {
  switch (symbol) {
    case 'SOL':
      return '#8c4cf4';
    case 'bSOL':
      return '#d16ba5';
    case 'mSOL':
      return '#5ffbf1';
    case 'USDC':
      return '#86a8e7';
    case 'USDT':
      return '#6bd188';
  }
};

export const getColor = (symbol: string) => {
  switch (symbol) {
    case 'SOL':
      return 'white';
    case 'bSOL':
      return 'white';
    case 'mSOL':
      return 'black';
    case 'USDC':
      return 'black';
    case 'USDT':
      return 'black';
  }
};
