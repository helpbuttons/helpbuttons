import configs from '@src/config/configuration';

export const getUrl = (locale, url) => {
    const localeUrl = locale == 'en' ? '' : `/${locale}` 
    return `${configs().hostName}${localeUrl}${url}`
};