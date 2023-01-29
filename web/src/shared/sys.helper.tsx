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

export function getLocale()
{
    const splitHref = getHref().split('/');
    if (splitHref.length > 2 && splitHref[3].length > 0)
    {
        return splitHref[3];
    }
    return 'en';
}