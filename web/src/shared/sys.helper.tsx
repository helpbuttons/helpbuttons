import { translations } from "i18n";

export function getShareLink(link)
{
    return `${getUrlOrigin()}${link}`;
}
export function getHostname() 
{
    return window.location.hostname;
}

export function getUrlOrigin() 
{
    return window.location.origin;
}

export function getHref()
{
    return window.location.href
}

export function getLocale(availableLocales = null)
{
    if ( !availableLocales ) {
        availableLocales = translations.map(({locale}) => {
            return locale;
        })
    }
    const splitHref = getHref().split('/');
    
    if (splitHref && splitHref.length > 2 && availableLocales.includes(splitHref[3]))
    {
        return splitHref[3];
    }
    return 'en';
}

export function makeImageUrl(image, baseUrl = '') {
    if(!image) {
      return 'fail.png';
    }
    const regex = /^data\:image/gm;
    const matches = image.match(regex);
    if ( !matches )
    {
      return `${baseUrl}${image}`;
    }
    return image
  }

export const defaultMarker = {latitude: 41.6870, longitude: -7.7406};
