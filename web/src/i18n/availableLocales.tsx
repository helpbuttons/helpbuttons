export const availableLocales = [
  { value: 'en', name: 'English' },
  { value: 'es', name: 'Español' },
  //   { value: 'pt', name: 'Português' },
  //   { value: 'eu', name: 'Euskera' },
  //   { value: 'cat', name: 'Catalá' },
];

export const localesFiles = [
  {
    locale: 'en',
    translations: require('../../public/locales/en/common.json'),
  },
  {
    locale: 'es',
    translations: require('../../public/locales/es/common.json'),
  },
  {
    locale: 'pt',
    translations: require('../../public/locales/pt/common.json'),
  },
  {
    locale: 'eu',
    translations: require('../../public/locales/eu/common.json'),
  },
  {
    locale: 'cat',
    translations: require('../../public/locales/cat/common.json'),
  },
];
