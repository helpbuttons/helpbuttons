import { GlobalState, store } from "state";
import { useEffect } from "react"
import { catchError, map, of, tap } from "rxjs";
import { isHttpError } from "services/HttpService";
import { UserService } from "services/Users";
import { SignupQRRequestDto, SignupRequestDto } from "shared/dtos/auth.dto";
import { HttpStatus } from "shared/types/http-status.enum";
import { UpdateEvent, WatchEvent } from "store/Event";
import { handleError } from "./helper";
import { IUser } from "services/Users/user.type";
import produce from "immer";
import { activitiesInitialState } from "./Activity";
import { UserUpdateDto } from "shared/dtos/user.dto";
import { InviteCreateDto } from "shared/dtos/invite.dto";
import { Invite } from "shared/entities/invite.entity";

export interface UsersState {
    currentUser: IUser;
}

export const usersInitial = {
    currentUser: undefined,
};


export class Login implements WatchEvent {
    public constructor(
        private email: string,
        private password: string,
        private onSuccess,
        private onError,
    ) { }

    public watch(state: GlobalState) {
        return UserService.login(this.email, this.password).pipe(
            map((userData) => {
                if (userData) {
                    return store.emit(new FetchUserData(this.onSuccess, this.onError));
                }
            }),
            catchError((error) => {
                let err = error.response;

                if (
                    isHttpError(err) &&
                    err.statusCode === HttpStatus.UNAUTHORIZED
                ) {
                    // Unauthorized
                    this.onError('login-incorrect');
                } else {
                    throw err;
                }
                return of(undefined);
            }),
        );
    }
}


export class LoginQR implements WatchEvent {
    public constructor(
        private qrcode: string,
        private password: string,
        private onSuccess,
        private onError,
    ) { }

    public watch(state: GlobalState) {
        return UserService.loginQr(this.qrcode, this.password).pipe(
            map((userData) => {
                if (userData) {
                    return store.emit(new FetchUserData(this.onSuccess, this.onError));
                }
            }),
            catchError((error) => {
                let err = error.response;

                if (
                    isHttpError(err) &&
                    err.statusCode === HttpStatus.UNAUTHORIZED
                ) {
                    // Unauthorized
                    this.onError('login-incorrect');
                } else {
                    throw err;
                }
                return of(null);
            }),
        );
    }
}

export class SignupUser implements WatchEvent {
    public constructor(
        private signupRequestDto: SignupRequestDto,
        private onSuccess,
        private onError,
    ) { }

    public watch(state: GlobalState) {
        return UserService.signup(this.signupRequestDto).pipe(
            map((token) => {
                if (token) {
                    return store.emit(new FetchUserData(this.onSuccess, this.onError))
                }
            }),
            catchError((error) => handleError(this.onError, error))
        );
    }
}

export class SignupQR implements WatchEvent {
    public constructor(
        private signupQRRequestDto: SignupQRRequestDto,
        private onSuccess,
        private onError,
    ) { }

    public watch(state: GlobalState) {
        return UserService.signupQR(this.signupQRRequestDto).pipe(
            map((token) => {
                if (token) {
                    return store.emit(new FetchUserData(this.onSuccess, this.onError))
                }
            }),
            catchError((error) => handleError(this.onError, error))
        );
    }
}

export class FetchUserData implements WatchEvent {
    public constructor(
        private onSuccess = undefined,
        private onError = undefined,
    ) { }

    public watch(state: GlobalState) {
        return UserService.whoAmI().pipe(
            tap((userData) => {
                if (userData && this.onSuccess) {
                    this.onSuccess(userData);
                }
            }),
            map((userData) => store.emit(new SetCurrentUser(userData))),
            catchError((error) => { store.emit(new SetCurrentUser(null)); return handleError(this.onError, error) })
        );
    }
}

export class SetCurrentUser implements UpdateEvent {
    public constructor(private currentUser: IUser) { }

    public update(state: GlobalState) {
        return produce(state, (newState) => {
            newState.sessionUser = this.currentUser;
        });
    }
}



export class FindExtraFieldsUser implements WatchEvent {
    public constructor(
      private userId,
      private onSuccess = undefined,
      private onError = undefined,
    ) {}
  
    public watch(state: GlobalState) {
      return UserService.findExtra(this.userId).pipe(
        map((userData) => { 
          // new AddUserToKnownUsers(userData);
          this.onSuccess(userData);
        }),
      );
    }
  }
  
export class RequestNewLoginToken implements WatchEvent {
    public constructor(
        private email: string,
        private onSuccess,
        private onError
    ) { }
    public watch(state: GlobalState) {
        return UserService.requestNewLoginToken(this.email).pipe(
            map(() => {
                this.onSuccess();
            }),
            catchError((error) => handleError(this.onError, error))
        );
    }
}


export class LoginToken implements WatchEvent {
    public constructor(
        private token: string,
        private onSuccess,
        private onError,
    ) { }

    public watch(state: GlobalState) {
        return UserService.loginToken(this.token).pipe(
            map((userData) => {
                if (userData) {
                    return store.emit(new FetchUserData(this.onSuccess, this.onError));
                }
            }),
            catchError((error) => { this.onError(); return of(undefined) })
        );
    }
}


export class UpdateProfile implements WatchEvent {
    public constructor(
        private data: UserUpdateDto,
        private onSuccess,
        private onError
    ) { }
    public watch(state: GlobalState) {
        return UserService.update(this.data).pipe(
            map((data) => {
                this.onSuccess(data);
            }),
            catchError((error) => handleError(this.onError, error))
        );
    }
}

export class SessionUserLogout implements UpdateEvent {
    public constructor() { }

    public update(state: GlobalState) {
        return produce(state, (newState) => {
            newState.sessionUser = null;
            newState.activities = activitiesInitialState;
        });
    }
}

export class DeleteProfile implements WatchEvent {
    public constructor() { }
    public watch(state: GlobalState) {
        return UserService.deleteme().pipe(
            map(() => {UserService.logout();store.emit(new SessionUserLogout())})
        )

    }
}



export class FollowTag implements WatchEvent, UpdateEvent {
    public constructor(
        private tag,
        private onSuccess = () => { },
    ) { }

    public watch(state: GlobalState) {
        return UserService.followTag(this.tag).pipe(
            map((userData) => {
                this.onSuccess();
            }),
            catchError((error) => { this.onSuccess(); return of(undefined) })
        )
    }

    public update(state: GlobalState) {
        return produce(state, (newState) => {

            let tags = [...state.sessionUser.tags]
            if (tags.indexOf(this.tag) > -1) {
                return;
            }
            tags.push(this.tag)
            newState.sessionUser.tags = tags;
        });
    }
}

export class FollowTags implements WatchEvent {
    public constructor(
        private tags,
        private onSuccess = () => { },
    ) { }

    public watch(state: GlobalState) {
        return UserService.followTags(this.tags).pipe(
            map((userTags) => {
                this.onSuccess();
                store.emit(new FollowedTags(userTags))
            }),
            catchError((error) => { this.onSuccess(); return of(undefined) })
        )
    }
}
export class FollowedTags implements UpdateEvent {
    public constructor(
        private tags
    ) { }
    public update(state: GlobalState) {
        return produce(state, (newState) => {
            newState.sessionUser.tags = this.tags;
        });
    }

}



export class CreateInvite implements WatchEvent {
    public constructor(public data: InviteCreateDto, private onSuccess) {}
  
    public watch(state: GlobalState) {
      return UserService.createInvite(this.data).pipe(
        map((data) => {
          store.emit(new FindInvites());
          this.onSuccess(data)
        }),
        catchError((error) => { return  of(undefined)})
      )
    }
  }



export class FindInvites implements WatchEvent {
    public constructor(
    ) {}
  
    public watch(state: GlobalState) {
      return UserService.invites().pipe(
        map((invites: Invite[]) => {
          store.emit(new SetInvites(invites))
        }),
        catchError((error) => {return  of(undefined)})
      )
    }
    
  }
  
  export class SetInvites implements UpdateEvent {
    public constructor(public invites: Invite[]) {}
  
    public update(state: GlobalState) {
      return produce(state, (newState) => {
        newState.invites = this.invites;
      });
    }
  }