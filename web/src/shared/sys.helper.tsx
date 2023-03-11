import { translations } from 'i18n';
import { pathToRegexp } from 'path-to-regexp';
import { allowedPathsPerRole } from './pagesRoles';
import { Role } from './types/roles';

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

export function getLocale(availableLocales = null) {
  if (!availableLocales) {
    availableLocales = translations.map(({ locale }) => {
      return locale;
    });
  }
  const splitHref = getHref().split('/');

  if (
    splitHref &&
    splitHref.length > 2 &&
    availableLocales.includes(splitHref[3])
  ) {
    return splitHref[3];
  }
  return 'en';
}

export function makeImageUrl(image, baseUrl = '') {
  if (!image) {
    return 'fail.png';
  }
  const regex = /^data\:image/gm;
  const matches = image.match(regex);
  if (!matches) {
    return `${baseUrl}${image}`;
  }
  return image;
}

export const defaultMarker = { latitude: 41.687, longitude: -7.7406 };

export function isRoleAllowed(role: Role, path): boolean {
  // console.log(`path: ${path} role ${role}`)
  if (pagesRolesCheck(path, role)) {
    return true;
  }

  if (role == Role.registered && pagesRolesCheck(path, Role.guest)) {
    return true;
  }

  if (role == Role.admin) {
    return true;
  }

  console.error(
    `trying to access a path not allowed path: ${path} role: ${role}`
  );
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

export function dateLeft(date: string) {
  // in miliseconds
  var units = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
  };

  var rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  var getRelativeTime = (d1, d2 = new Date()) => {
    var elapsed = Date.parse(d1) - d2.getTime();

    // "Math.abs" accounts for both "past" & "future" scenarios
    for (var u in units)
      if (Math.abs(elapsed) > units[u] || u == 'second')
        return rtf.format(Math.round(elapsed / units[u]), u);
  };

  return getRelativeTime(new Date(date));
}
