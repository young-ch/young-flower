export default {
  // current currency
  currency: {
    label: '원',
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
    currencySymbol: '₩',
    currencySymbolNumberOfSpaces: 0,
    currencySymbolPosition: 'left'
  },

  // availabled currencies for user selection
  availableCurrencies: [
    {
      label: '원',
      decimalDigits: 2,
      decimalSeparator: '.',
      thousandsSeparator: ',',
      currencySymbol: '₩',
      currencySymbolNumberOfSpaces: 0,
      currencySymbolPosition: 'left'
    },
    {
      label: 'USD',
      decimalDigits: 2,
      decimalSeparator: '.',
      thousandsSeparator: ',',
      currencySymbol: '$',
      currencySymbolNumberOfSpaces: 0,
      currencySymbolPosition: 'left'
    },
    {
      label: 'EUR',
      decimalDigits: 2,
      decimalSeparator: '.',
      thousandsSeparator: ',',
      currencySymbol: '€',
      currencySymbolNumberOfSpaces: 1,
      currencySymbolPosition: 'right'
    }
  ]
}
