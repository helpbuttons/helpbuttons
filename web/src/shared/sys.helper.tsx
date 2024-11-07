import { translations } from 'i18n';
import { pathToRegexp } from 'path-to-regexp';
import { allowedPathsPerRole } from './pagesRoles';
import { Role } from './types/roles';
import getConfig from 'next/config';

let SSRLocale = 'en';

export function setSSRLocale(_locale) {
  SSRLocale = _locale;
}
export function getShareLink(link) {
  const locale = (getLocale() == 'en' )? '' : `/${getLocale()}`
  return `${getUrlOrigin()}${locale}${link}`;
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

export function getLocale(availableLocales = null) {
  if (!availableLocales) {
    availableLocales = translations.map(({ locale }) => {
      return locale;
    });
  }
  try {
    const splitHref = getHref().split('/');

    if (
      splitHref &&
      splitHref.length > 2 &&
      availableLocales.includes(splitHref[3])
    ) {
      return splitHref[3];
    }
  } catch (err) {
    return SSRLocale;
  }
  return SSRLocale;
}

export function makeImageUrl(image) {
  const { publicRuntimeConfig } = getConfig()

  if (!image) {
    return '/assets/images/noIcon.png';
  }
  const regex = /^data\:image/gm;
  const matches = image.match(regex);
  if (!matches) {
    const regexHref = /^(http|https)/gm;
    if (image.match(regexHref)) {
      return image;
    }
    return `${publicRuntimeConfig.apiUrl}${image}`;
  }
  return image;
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
    return <>&infin; m</>
  }
  if(distanceInMeters < 1001)
  {
    return  `${distanceInMeters} m`
  }
  return  `${(distanceInMeters/1000).toFixed(2)} km`
}