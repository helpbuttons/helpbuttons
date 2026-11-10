import configs from '@src/config/configuration';

export const getUrl = (url) => {
    return `${configs().WEB_URL}${url}`
};