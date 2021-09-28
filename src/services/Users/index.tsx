import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userObs = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
};

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


}
