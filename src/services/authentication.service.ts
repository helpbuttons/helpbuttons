import { BehaviorSubject } from 'rxjs';
import { handleResponse } from '../helpers/handleResponse.tsx';

export const currentUserSubject = new BehaviorSubject('');

export function giveCurrentUserValue () {

  useEffect(() => {
      authenticationService.currentUserSubject = JSON.parse(localStorage.getItem('currentUser'))
  },[])

};

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`http://127.0.0.1:3001/api/users/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
