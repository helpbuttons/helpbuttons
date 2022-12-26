export const localStorageService = {
  save,
  read,
  remove
};

export enum LocalStorageVars {
  ACCESS_TOKEN = 'access_token',
  TOKEN_TYPE = 'token_type',
  NETWORK_SELECTED = 'network_id'
}

// add variable to localStorage to not loose on refresh
function save(name: LocalStorageVars, data: any) {
  if (typeof window !== typeof undefined) {
    return window.localStorage.setItem(name, data);
  }
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
