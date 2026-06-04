/**
 * 
 * How to use this? 
 * $ node updateTranslationString.js
 * automatically this will search for all new translations strings, and create new entries on the language files in public/locales/common.json
 */

const { exec } = require('child_process');
var _ = require('lodash');
const fs = require('fs')

const translationFile = (locale) => {
  return `../public/locales/${locale}/common.json`;
};

const saveTranslatioFile = (locale, data) => {
  return fs.writeFileSync(`../public/locales/${locale}/common.json`, JSON.stringify(data, null, 2));
};

// const allLocales = ['en', 'es', 'cat', 'eu', 'pt'];

const syncTranslations = (language, foundTranslations) => {
  let allTranslations = [];
  let toSaveTranslations = [];

  allTranslations = ["en", language].map((locale) => {
    return {locale: locale, translations: require(translationFile(locale))};
  });
  const englishTranslations = allTranslations.find((elem) => elem.locale == 'en').translations
  foundTranslations.map((foundTranslation) => {
    toSaveTranslations = allTranslations.map(({locale, translations}) => {
      if(!_.get(translations, foundTranslation))
      {
        console.log(`Adding new ${foundTranslation} to ${locale}`)
        const englishTranslation = _.get(englishTranslations, foundTranslation)
        _.set(translations, foundTranslation, englishTranslation);
      }
      return {locale, translations}
    })
  });

  toSaveTranslations.forEach(({locale, translations}) => {
    // only save en language, so that weblate updates if index is not found
      console.log(`saving ${locale}`)
      saveTranslatioFile(locale,translations)
      
  })
};

const getTranslations = (language) => {
  exec(
    `grep -ro -E "t\\('[a-zA-Z]*\.[a-zA-Z]*" ../src/ | cut -f 2 -d:`,
    (error, stdout, stderr) => {
      let strings = stdout.split('\n');
      const regex = /[a-zA-Z]+\.[a-zA-Z]+/gm;
      strings = strings.map((string) =>  string.substring(3))
      const searchingTranslations = strings.filter((string) => {
        const res = regex.exec(string)
        if(res !== null)
        {
          return true;
        }
        return false;
      })

      syncTranslations(language, searchingTranslations);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    },
  );
};
const language = process?.argv[2];
if (!language) {
  console.error('Usage: node updateTranslationStrings.js <locale>  (e.g. es, cat, eu, pt)');
  process.exit(1);
}
getTranslations(language);
