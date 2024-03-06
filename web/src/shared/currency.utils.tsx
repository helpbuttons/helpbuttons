export const availableCurrencies = [
    {
      value: 'EUR',
      name: formatCurrency(100, 'EUR'),
      caption: '€',
    },
    {
      value: 'BTC',
      name: formatCurrency(100, 'BTC'),
      caption: 'BTC'
    },
    {
      value: 'USD',
      name: formatCurrency(100, 'USD'),
      caption: '$'
    },
    {
      value: 'Junas',
      name: formatCurrency(100, 'Junas'),
      caption: 'Junas'
    },
  ];
  export function getSymbol(currency: string) {
    return availableCurrencies.find((value) => value.value == currency).caption
  }
export function formatCurrency(value = 0, currency) {
    
    if (currency == 'EUR') {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
      }).format(value);
    }
    if (currency == 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    }
    if (currency == 'BTC') {
      return formatBTC(value);
    }
    return value + ' ' + currency;
    
    function formatBTC(amount) {
      return amount + ' BTC';
    }
  }