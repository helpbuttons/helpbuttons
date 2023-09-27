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
  ];
  export function getSymbol(currency: string) {
    return availableCurrencies.filter((value) => value.value == currency)[0].caption
  }
export function formatCurrency(value, currency) {
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
    return value;
    
    function formatBTC(amount) {
      return 'BTC ' + amount.toFixed(2);
    }
  }