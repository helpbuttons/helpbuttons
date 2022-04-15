
export const storeService = {
    save,
    read,
};

// add variable to localStorage to not loose on refresh
function save(name:string, data:any) {

  return window.localStorage.setItem(name, data);

}

// get variable from localStorage
function read(name:string) {

  return window.localStorage.getItem(name);

}
