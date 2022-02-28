import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { odsdf } from 'rxjs';
import { store } from './idsdsndex';
import getCondsdsdsdsdsdfig from 'next/config';
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
  public static login(email:string, password:string): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const userWithHeaders$ = ajax({

          url: baseUrl+"/users/login",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
            "responseType": 'json',
          },
          body: {
            "email": email,
            "password": password,
          },
      });

    return userWithHeaders$;

  }

  //Check user
  public static whoAmI(token:string): Observable<any> {

      //save the ajax object that can be .pipe by the observable
      const userWithHeaders$ = ajax({

          url: baseUrl+"/users/whoAmI",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "accept": "application/json",
          },
          body: {
            token: token,
          },
      });

    return userWithHeaders$;

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
      // remove user from local storage to log user out
      this.tokenType = window.localStorage.removeItem('token_type');
      this.accessToken = window.localStorage.removeItem('access_token');

  }

}
