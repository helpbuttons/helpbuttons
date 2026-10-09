import { isStaticApp } from './environment';

export function require_try<T>(path: string): T | undefined {
  if (!isStaticApp()) return undefined;

  try {
    console.log('TODO should require...')
    return ;
    // const dynamicRequire = eval('require') as NodeRequire;
    // return dynamicRequire(path) as T;
  } catch (err) {
    console.error('Could not load optional module:', err);
    return undefined;
  }
}