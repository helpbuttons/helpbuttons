import { pathToRegexp } from 'path-to-regexp';
import { allowedPathsPerRole } from './pagesRoles';
import { Role } from './types/roles';

export const logoImageUri = '/network/logo/'; // [16, 32, 48, 72, 96, 144, 168, 180, 192]
export let locale = 'en';

export function setLocale(_locale) {
  locale = _locale;
  setLocaleCookie(_locale)
}
export function getShareLink(link) {
  return `${getUrlOrigin()}${link}`;
}
export function getHostname() {
  return window.location.hostname;
}

export function getUrlOrigin() {
  return window.location.origin;
}

export function getHref() {
  return window.location.href;
}

export function getLocaleFromCookie(): string | null {
  try {
    const match = document.cookie.match(/locale=([^;]+)/);
    return match ? match[1] : locale;
  } catch (err) {
    return locale;
  }
}

export function setLocaleCookie(locale: string, days = 365): void {
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `locale=${locale};expires=${expires.toUTCString()};path=/`;
  } catch (err) {
    // console.log(err)
  }
}
export function getLocale() {
  return getLocaleFromCookie()
}

export function isRoleAllowed(role: Role, path): boolean {
  if (pagesRolesCheck(path, role)) {
    return true;
  }

  if (role == Role.registered && pagesRolesCheck(path, Role.guest)) {
    return true;
  }

  if (role == Role.admin) {
    return true;
  }

  // console.error(
  //   `trying to access a path not allowed path: ${path} role: ${role}`
  // );
  return false;

  function pagesRolesCheck(path, role: Role) {
    const allowedPaths = allowedPathsPerRole.filter(
      (allowedPerRole) => allowedPerRole.role == role,
    )[0].paths;

    if (allowedPaths.includes(path)) {
      return true;
    }
    return (
      allowedPaths.filter((allowedPath) => {
        return pathToRegexp(allowedPath).exec(path);
      }).length > 0
    );
  }
}

export const tagify = (str) => {
  let strOut = str.replace(
    /[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g,
    ' ',
  );
  strOut = strOut.replace(/\s+|\s+/gm, '');
  return strOut;
};

export const uniqueArray = (a) =>
  Array.from(new Set(a.map((o) => JSON.stringify(o)))).map((s) =>
    JSON.parse(s),
  );

export const getUrlParams = (path, router) => {
  const findHash = path.indexOf('?');
  if (findHash) {
    let params = new URLSearchParams(
      router.asPath.substr(findHash + 1),
    );
    return params;
  }
  return [];
};

export const getReturnUrl = () => {
  return document.location.pathname + document.location.search 
}

export const findError = (errorsToFind, errors) => {
  if (Object.keys(errors).length < 1) {
    return false;
  }
  return errorsToFind.reduce((acc, currentField) => {
    return acc ? acc : errors[currentField]
  }, false)
}

export function readableDistance(distanceInMeters){
  if(!distanceInMeters)
  {
    return `∞ m`
  }
  if(distanceInMeters < 1001)
  {
    return  `${distanceInMeters} m`
  }
  return  `${(distanceInMeters/1000).toFixed(2)} km`
}


export function nextElement(currentId, elements) {
  const index = elements.findIndex(element => element.id === currentId);
  
  if (index !== -1 && index < elements.length - 1) {
      return elements[index + 1];
  }

  return null;
}


export function previousElement(currentId, elements) {
  const index = elements.findIndex(element => element.id === currentId);
  
  if ( index - 1 >= 0 ) {
      return elements[index - 1];
  }

  return null;
}

export const getEmailPrefix = (email) => {
  if (!email) return '';
  return email.replace(/^(.{1,4})(?=[^@]*@)|(?!^)[^@](?=[^@]*@)/g, (match, p1) => 
    p1 ? p1 + '***' : '***'
  
  );
};

export const stringContains = (str1, str2) => {
  if (str1.toLowerCase().includes(str2.toLowerCase())) {
    return true;
  }
  return false;
}