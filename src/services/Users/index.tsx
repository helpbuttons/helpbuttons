import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { UserData } from './user.type';
import { OpenApi } from './types';
// require('dotenv').config();

const backendUri = "https://localhost:3001";

// export const userService = {
//     getAll
// };

export class UserDataService {


  public static getAll(): Observable<UserData> {
    return ajax.get(`${backendUri}/api/users`);
  }

  public static get(id: string): Observable<UserData> {
    return ajax.get(`${backendUri}/users/${id}`);
  }

  public static login(username: string, password:string): Observable<UserData> {
    return ajax.post(`${backendUri}/users/login`,{ username, password });
  }

  public static signup(username: string, password:string): Observable<UserData> {
    return ajax.post(`${backendUri}/users/login`,{ username, password });
  }

  // public static signup(data: UserData): Observable<UserData> {
  //   return ajax.post(`${backendUri}/users/signup`,data);
  // }

  public static update(data: UserData, id:any): Observable<UserData> {
    return ajax.put(`${backendUri}/users/${id}`,data);
  }

  public static delete(id:any): Observable<UserData> {
    return ajax.delete(`${backendUri}/users/${id}`);
  }

  public static deleteAll(id:any): Observable<UserData> {
    return ajax.delete(`${backendUri}/users`);
  }


}



// function getAll() {
//     const requestOptions = { method: 'GET', headers: authHeader() };
//     return fetch(`http://localhost:3001/users`, requestOptions).then(handleResponse);
// }
