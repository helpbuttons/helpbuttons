import { getLocale } from 'shared/sys.helper';

const translations = [
  {
    locale: 'en',
    translations: require('../../public/locales/en/common.json'),
  },
  {
    locale: 'es',
    translations: require('../../public/locales/es/common.json'),
  },
];
export default function t(key: string, defaultValue: string = '') {
  const availableLocales = translations.map(({locale, translations}) => {
    return locale;
  })
  const locale = getLocale(availableLocales);

  const translatedString = getTranslation(locale, key);
  if (translatedString === false || !translatedString) {
    return defaultValue;
  }

  return translatedString;
}

function getTranslation(locale, key) {
  let keys = key.split('.');

  const selectedTranslations = translations.find(
    (item) => item.locale == locale,
  );
  if (selectedTranslations)
    if (keys.length > 1) {
      if (selectedTranslations.translations[keys[0]] && selectedTranslations.translations[keys[0]][keys[1]]) {
        return selectedTranslations.translations[keys[0]][keys[1]];
      }
      
      return `Add me to your translations file. (key: ${key} locale: ${locale})`;

    } else if (keys.length > 0) {
      return selectedTranslations.translations[keys[0]];
    }
  return null;
}
