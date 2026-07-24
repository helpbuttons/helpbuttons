import getEnvConfig from 'next/config';

export function getApiUrl(): string {

  const { publicRuntimeConfig } = getEnvConfig();
  return publicRuntimeConfig.apiUrl
}

export function isStaticApp(): string {

  const { publicRuntimeConfig } = getEnvConfig();
  return publicRuntimeConfig.isStaticApp
}

export function getBgcolor(): string {

  const { publicRuntimeConfig } = getEnvConfig();
  return publicRuntimeConfig?.bgcolor ? publicRuntimeConfig?.bgcolor : '#7fdfce'
}