import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { authHeader, handleResponse } from '../helpers';
import { UserData } from './user.type';
import { OpenApi } from './types';

export const userService = {
    getAll
};

export class UserDataService {


  public static getAll(): Observable<UserData> {
    return ajax.get(`http://localhost:3001/api/users`);
  }

  public static get(id: string): Observable<UserData> {
    return ajax.get(`http://localhost:3001/users/${id}`);
  }

  public static login(username: string, password:string): Observable<UserData> {
    return ajax.post(`http://127.0.0.1:3001/users/login`,{ username, password });
  }

  public static signup(data: UserData): Observable<UserData> {
    return ajax.post(`http://localhost:3001/users/signup`,data);
  }

  public static update(data: UserData, id:any): Observable<UserData> {
    return ajax.put(`http://localhost:3001/users/${id}`,data);
  }

  public static delete(id:any): Observable<UserData> {
    return ajax.delete(`http://localhost:3001/users/${id}`);
  }

  public static deleteAll(id:any): Observable<UserData> {
    return ajax.delete(`http://localhost:3001/users`);
  }


}





function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`http://localhost:3001/users`, requestOptions).then(handleResponse);
}
