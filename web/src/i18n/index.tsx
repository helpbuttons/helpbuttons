import { getLocale } from 'shared/sys.helper';
import ReactHtmlParser from 'react-html-parser';
import { localesFiles } from './availableLocales';

let nomeclature = 'helpbutton'
let nomeclaturePlural = 'helpbuttons'

export default function t(key: string, args: string[] = [], avoidHtmlParserUse = false) {
  const availableLocales = localesFiles.map(({locale, translations}) => {
    return locale;
  })
  const locale = getLocale(availableLocales);
  // const locale = getLocale();
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
  if (avoidHtmlParserUse)
  {
    return translatedString
  }
  return ReactHtmlParser(translatedString);
}

export function updateNomeclature(singular, plural) {
  if(singular)
  {
    nomeclature = singular
  }
  if(plural)
  {
    nomeclaturePlural = plural;
  }
  
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
  

  const selectedTranslations = localesFiles.find(
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

function setNomeclature(locale, translatedString)
{
    const translating = translatedString.replace('_helpbuttons_', nomeclaturePlural)
    return translating.replace('_helpbutton_', nomeclature)
  }