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

export function getLocale(availableLocales)
{
    const splitHref = getHref().split('/');
    if (splitHref.length > 2 && availableLocales.includes(splitHref[3]))
    {
        return splitHref[3];
    }
    return 'en';
}

export function makeImageUrl(image) {
    // debugger;
    if(!image) {
      return 'fail.png';
    }
    const regex = /^data\:image/gm;
    const matches = image.match(regex);
    
    if ( !matches )
    {
      return `/api${image}`;
    }
    return image
  }