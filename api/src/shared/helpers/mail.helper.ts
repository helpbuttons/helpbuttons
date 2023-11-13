import { configFileName } from '@src/shared/helpers/config-name.const';
const config = require(`../../..${configFileName}`);

export const getUrl = (locale, url) => {
    const localeUrl = locale == 'en' ? '' : `/${locale}` 
    return `${config.hostName}${localeUrl}${url}`
};