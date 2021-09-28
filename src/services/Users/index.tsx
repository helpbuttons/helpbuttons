import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { IUser } from './user.type';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    login,
    signup,
    getAll,
    getById,
    update,
};

function signup(email: string, password: string) {

    return ajax.post(`${baseUrl}/users/signup`, JSON.stringify({
      body: {
        "email": email,
        "password": password
      }
    }));

}

function login(data: IUser, id:any): Observable<IUser> {

    return ajax.post(`${baseUrl}/users/login`, JSON.stringify({
      body: {
        "email": data.username,
        "password": data.password
      }
    }));

}

function getAll(): Observable<IUser> {
  return ajax.get(`${backendUri}/api/users`);
}

function getById(id: string): Observable<IUser> {
  return ajax.get(`${backendUri}/users/${id}`);
}

function update(data: IUser, id:any): Observable<IUser> {
  return ajax.put(`${backendUri}/users/${id}`,data);
}
