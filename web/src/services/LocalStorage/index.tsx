export const localStorageService = {
  save,
  read,
  remove
};

export enum LocalStorageVars {
  ACCESS_TOKEN = 'access_token',
  TOKEN_TYPE = 'token_type',
  NETWORK_SELECTED = 'network_id',
  EXPLORE_SETTINGS='explore_settings',
  HAS_PERMISSION_NOTIFICATIONS='has_permission_notifications',
  COOKIES_ACCEPTANCE='cookies_acceptance'
}

// add variable to localStorage to not loose on refresh
function save(name: LocalStorageVars, data: any) {
  if (typeof window !== typeof undefined) {
    if(name == LocalStorageVars.COOKIES_ACCEPTANCE)
    {
      return window.localStorage.setItem(name, data);  
    }else{
      if(window.localStorage.getItem(LocalStorageVars.COOKIES_ACCEPTANCE) !== null)
      {
        return window.localStorage.setItem(name, data);
      }
    }
  }
  console.error('You rejected cookies previously')
}

// get variable from localStorage
function read(name: LocalStorageVars) {
  if (typeof window !== typeof undefined) {
    return window.localStorage.getItem(name) || undefined;
  } else {
    return undefined;
  }
}

function remove(name: LocalStorageVars) {
  if (typeof window !== typeof undefined) {
    return window.localStorage.removeItem(name);
  }
}