import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IUser, ICurrentUser } from "./network.type";
import { httpService } from "services/HttpService";
import { SignupQRRequestDto, SignupRequestDto } from 'shared/dtos/auth.dto';
import { User } from 'shared/entities/user.entity';
import { Logout } from 'state/Profile';
import { store } from 'pages';
import { UserUpdateDto } from 'shared/dtos/user.dto';
import { Role } from 'shared/types/roles';
import { InviteCreateDto } from 'shared/dtos/invite.dto';
import { Invite } from 'shared/entities/invite.entity';

//User services for all app
export class UserService {

  //Signup in the new user
  public static signup(signupRequestDto : SignupRequestDto): Observable<any> {
    return httpService.post<ICurrentUser>("users/signup", signupRequestDto).pipe(
      tap((response) => httpService.setAccessToken(response?.token))
    );
  }

  public static signupQR(signupRequestDto : SignupQRRequestDto): Observable<any> {
    return httpService.post<ICurrentUser>("users/signupQR", signupRequestDto).pipe(
      tap((response) => httpService.setAccessToken(response?.token))
    );
  }

  //Login user
  public static login(email:string, password:string): Observable<ICurrentUser | undefined> {
    return httpService.post<ICurrentUser>("users/login", {email, password}).pipe(
      tap((user) => httpService.setAccessToken(user?.token))
    );
  }

  public static loginQr(qrcode:string, password:string): Observable<ICurrentUser | undefined> {
    return httpService.post<ICurrentUser>(`users/loginqr/${qrcode}`).pipe(
      tap((user) => httpService.setAccessToken(user?.token))
    );
  }
  
  public static isLoggedIn(): boolean {
    return httpService.isAuthenticated$.value;
  }

  //Check user
  public static whoAmI(): Observable<any> {
    return httpService.get<IUser>("users/whoami");
  }

  public static findUser(username: string)
  {
    return httpService.get<User>(`users/find/${username}`);
  }


  public static logout() {
    httpService.clearAccessToken();
  }

  public static update(data: UserUpdateDto): Observable<any> {
    return httpService.post<UserUpdateDto>("users/update", data);
  }

  public static requestNewLoginToken(email:string): Observable<ICurrentUser | undefined> {
    return httpService.get<ICurrentUser>(`users/requestNewLoginToken/${email}`);
  }

  public static loginToken(token :string): Observable<ICurrentUser | undefined> {
    return httpService.get<ICurrentUser>(`users/loginToken/${token}`).pipe(
      tap((user) => httpService.setAccessToken(user?.token)));
  }

  public static invites(): Observable<[Invite]> {
    return httpService.get<[Invite]>(`users/invites`);
  }

  public static createInvite(newInvitation: InviteCreateDto): Observable<Invite> {
    return httpService.post<Invite>(`users/createInvite`, newInvitation);
  }

  public static invite(code: string): Observable<any> {
    return httpService.get<any>(`users/invite/${code}`);
  }

  public static updateRole(userId : string,newRole :Role): Observable<any> {
    return httpService.post<any>(`users/updateRole/${userId}/${newRole}`);
  }

  public static moderationList(page): Observable<any> {
    return httpService.get<any>(`users/moderationList/${page}`);
  }

  public static find(username: string): Observable<any> {
    return httpService.get<any>(`users/find/${username}`);
  }
  
  public static unsubscribe(email : string): Observable<any> {
    return httpService.post<any>(`users/unsubscribe/${email}`);
  }

  public static findByOwner(userId : string): Observable<any> {
    return httpService.get<any>(`buttons/findByOwner/${userId}`);
  }

  public static followTag(tag : string): Observable<any> {
    return httpService.post<any>(`users/followTag/${tag}`);
  }

  public static followTags(tags : string): Observable<any> {
    return httpService.post<any>(`users/followTags/${tags}`);
  }

  public static findExtra(userId: string)
  {
    return httpService.get<User>(`users/findExtra/${userId}`);
  }
  
  public static getPhone(userId : string): Observable<any> {
    return httpService.get<string>(`users/getPhone/${userId}`);
  }

  public static deleteme(): Observable<any>{
    return httpService.get<any>(`users/deleteme`)
  }
}
