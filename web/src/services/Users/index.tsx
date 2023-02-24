import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import getConfig from 'next/config';
import { IUser, ICurrentUser } from "./network.type";
import { httpService } from "services/HttpService";
import { localStorageService, LocalStorageVars } from 'services/LocalStorage';
import { SignupRequestDto } from 'shared/dtos/auth.dto';
import { User } from 'shared/entities/user.entity';
import { Logout } from 'state/Users';
import { store } from 'pages';
import { UserUpdateDto } from 'shared/dtos/user.dto';
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

//User services for all app
export class UserService {

  //Signup in the new user
  public static signup(signupRequestDto : SignupRequestDto): Observable<any> {
    return httpService.post<ICurrentUser>("/users/signup", signupRequestDto).pipe(
      tap((response) => httpService.setAccessToken(response?.token))
    );
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

  public static findUser(username: string)
  {

    return httpService.get<User>(`users/find/${username}`);
  }

  public static logout() {
    store.emit(new Logout());
    httpService.clearAccessToken();
  }

  public static update(data: UserUpdateDto): Observable<any> {
    return httpService.post<UserUpdateDto>("/users/update", data);
  }
}
