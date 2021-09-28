import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { UserData } from './user.type';
// require('dotenv').config();

const backendUri = "https://localhost:3001";

import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers/fetchWrapper';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    login,
    logout,
    signup,
    getAll,
    getById,
    update,
    delete: _delete
};

// function getAll(): Observable<UserData> {
//   return ajax.get(`${backendUri}/api/users`);
// }

// function getById(id: string): Observable<UserData> {
//   return ajax.get(`${backendUri}/users/${id}`);
// }

function login(username, password) {
    return fetchWrapper.post(`${baseUrl}/users/login`, { username, password })
        .then(user => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function signup(user) {

    debugger
    console.log(baseUrl);
    console.log(`${baseUrl}/users/signup`);
    console.log(user.name);
    
    return ajax.post(`${baseUrl}/users/signup`, user);

    // return fetchWrapper.post(`${baseUrl}/users/signup`, user);
}

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}



// function signup(username: string, password:string): Observable<UserData> {
//   return ajax.post(`${backendUri}/users/signup`,{ username, password });
// }

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/account/login');
}

function update(data: UserData, id:any): Observable<UserData> {
  return ajax.put(`${backendUri}/users/${id}`,data);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}
//
// function delete(id:any): Observable<UserData> {
//   return ajax.delete(`${backendUri}/users/${id}`);
// }
//
// function deleteAll(id:any): Observable<UserData> {
//   return ajax.delete(`${backendUri}/users`);
// }
