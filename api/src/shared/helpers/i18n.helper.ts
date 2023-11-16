// IF UPDATED NEED TO CHECK THE FILE IN THE WEB PLEASE
// in web/i18n/18n.tsx
export const translations = [
    {
      locale: 'en',
      translations: require('../../../locales/en/common.json'),
    },
    {
      locale: 'es',
      translations: require('../../../locales/es/common.json'),
    },
  ];
  export default function translate(locale: string,key: string, args: string[] = []) : string{
    const availableLocales = translations.map(({locale, translations}) => {
      return locale;
    })
  
    let translatedString = getTranslation(locale, key);
    if (translatedString === false || !translatedString) {
      translatedString = getTranslation('en', key)
    }
    if (args && args.length > 0 && translatedString) {
      translatedString = format(translatedString, args)
    }
    if(!translatedString){ // if string not found on translations, show key
      translatedString = key;
    }
    translatedString = setNomeclature(locale, translatedString)

    return translatedString;
  }
  
  function format(string, args) {
      return string.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
        ;
      })
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
        return false;
      } else if (keys.length > 0) {
        return selectedTranslations.translations[keys[0]];
      }
    return null;
  }
  

let nomeclature = 'helpbutton'
let nomeclaturePlural = 'helpbuttons'

export function updateNomeclature(singular, plural) {
  nomeclature = singular;
  nomeclaturePlural= plural;
}

function setNomeclature(locale, translatedString)
{
    const translating = translatedString.replace('_helpbuttons_', nomeclaturePlural)
    return translating.replace('_helpbutton_', nomeclature)
  }