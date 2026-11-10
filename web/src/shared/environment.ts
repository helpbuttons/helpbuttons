import getEnvConfig from 'next/config';

export function getApiUrl(): string {

  const { publicRuntimeConfig } = getEnvConfig();
  return publicRuntimeConfig.apiUrl
}

export function isStaticApp(): boolean {

  const { publicRuntimeConfig } = getEnvConfig();
  return false;
  // return publicRuntimeConfig.isStaticApp
}

export function getBgcolor(): string {

  const { publicRuntimeConfig } = getEnvConfig();
  return publicRuntimeConfig.bgcolor
}