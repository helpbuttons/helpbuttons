/**
 * 
 * How to use this? 
 * $ node updateTranslationString.js
 * automatically this will search for all new translations strings, and create new entries on the language files in public/locales/common.json
 */

const { exec } = require('child_process');
var _ = require('lodash');
const fs = require('fs')

const translatioFile = (locale) => {
  return `../public/locales/${locale}/common.json`;
};

const saveTranslatioFile = (locale, data) => {
  return fs.writeFileSync(`../public/locales/${locale}/common.json`, JSON.stringify(data, null, 2));
};

const allLocales = ['es', 'en'];

const syncTranslations = (foundTranslations) => {
  let allTranslations = [];
  let localesToUpdate = [];

  allTranslations = allLocales.map((locale) => {
    return {locale: locale, translations: require(translatioFile(locale))};
  });
  foundTranslations.map((foundTranslation) => {
    allTranslations = allTranslations.map(({locale, translations}) => {
      if(!_.get(translations, foundTranslation))
      {
        if(!localesToUpdate[locale])
        {
          localesToUpdate.push(locale)
        }
        console.log(`Adding new ${foundTranslation} to ${locale}`)
        _.set(translations, foundTranslation, 'not set');
      }
      return {locale, translations}
    })
  });

  allTranslations.forEach(({locale, translations}) => {
    if(locale.indexOf(localesToUpdate)){
      console.log(`saving ${locale}`)
      saveTranslatioFile(locale,translations)
    }
      
  })
};

const getTranslations = () => {
  exec(
    `grep -ro {t\\(\\'[a-zA-Z]*\\.[a-zA-Z]*\\'\\)} ../src/ | cut -f 2 -d:`,
    (error, stdout, stderr) => {
      const strings = stdout.split('\n');
      let searchingTranslations = strings.map((value) => {
        value = value.replaceAll("{t('", '');
        value = value.replaceAll("')}", '');
        return value;
      });
      searchingTranslations = searchingTranslations.filter(
        (value) => value.length,
      );

      syncTranslations(searchingTranslations);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    },
  );
};

getTranslations();
