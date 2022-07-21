import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { store } from './index';
import getConfig from 'next/config';
import { IUser, ICurrentUser } from "./network.type";
import { httpService } from "services/HttpService";
import { localStorageService, LocalStorageVars } from 'services/LocalStorage';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

//User services for all app
export class UserService {

  //Signup in the new user
  public static signup(email:string, password:string): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const userWithHeaders$ = ajax({

          url: baseUrl+"/users/signup",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {
            "email": email,
            "password": password,
          },
      });

    return userWithHeaders$;

  }

  //Login user
  public static login(email:string, password:string): Observable<ICurrentUser | undefined> {
    return httpService.post<ICurrentUser>("/users/login", {email, password}).pipe(
      tap((user) => httpService.setAccessToken(user?.token))
    );
  }

  public static isLoggedIn(): boolean {
    return httpService.isAuthenticated$.value;
  }

  //Check user
  public static whoAmI(): Observable<any> {
    return httpService.get<IUser>("/users/whoami");
  }

  //Login user
  public static activate(token: any): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const userWithHeaders$ = ajax({

          url: baseUrl+"/users/activate/"+token,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {

            "verificationToken": token,

          },
      });

    return userWithHeaders$;

  }

  public static logout() {
    httpService.setAccessToken(undefined);
  }
}
