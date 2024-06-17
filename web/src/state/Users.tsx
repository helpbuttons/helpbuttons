import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { produce } from 'immer';

import { WatchEvent, UpdateEvent, EffectEvent } from 'store/Event';

import { IUser } from 'services/Users/types';
import { UserService } from 'services/Users';

import { HttpService, isHttpError } from 'services/HttpService';
import { SignupRequestDto } from 'shared/dtos/auth.dto';
import { GlobalState, store } from 'pages';
import { HttpStatus } from 'shared/types/http-status.enum';
import { handleError } from './helper';
import { UserUpdateDto } from 'shared/dtos/user.dto';
import { ButtonService } from 'services/Buttons';
import { Role } from 'shared/types/roles';
import { Invite } from 'shared/entities/invite.entity';
import { InviteCreateDto } from 'shared/dtos/invite.dto';

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
  ) {}

  public watch(state: GlobalState) {
    return UserService.login(this.email, this.password).pipe(
      map((userData) => {
        if (userData) {
          return new FetchUserData(this.onSuccess, this.onError);
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

export class SignupUser implements WatchEvent {
  public constructor(
    private signupRequestDto: SignupRequestDto,
    private onSuccess,
    private onError,
  ) {}

  public watch(state: GlobalState) {
    return UserService.signup(this.signupRequestDto).pipe(
      map((token) => {
        if (token) {
          return new FetchUserData(this.onSuccess, this.onError);
        }
      }),
      catchError((error) => handleError(this.onError,error))
    );
  }
}

export class FetchUserData implements WatchEvent {
  public constructor(
    private onSuccess = undefined,
    private onError = undefined,
  ) {}

  public watch(state: GlobalState) {
    return UserService.whoAmI().pipe(
      tap((userData) => {
        if (userData && this.onSuccess) {
          this.onSuccess(userData);
        }
      }),
      map((userData) => new SetCurrentUser(userData)),
      catchError((error) => handleError(this.onError, error))
    );
  }
}

export class SetCurrentUser implements UpdateEvent {
  public constructor(private currentUser: IUser) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.loggedInUser = this.currentUser;
    });
  }
}

export class AddUserToKnownUsers implements UpdateEvent {
  public constructor(private newUser: IUser) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.knownUsers.push(this.newUser);
    });
  }
}

export class FindUser implements WatchEvent {
  public constructor(
    private username,
    private onSuccess = undefined,
    private onError = undefined,
  ) {}

  public watch(state: GlobalState) {
    return UserService.findUser(this.username).pipe(
      map((userData) => { 
        new AddUserToKnownUsers(userData);
        this.onSuccess(userData);
      }),
    );
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
export class Logout implements UpdateEvent {
  public constructor() {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.loggedInUser = null;
      newState.activities = []
    });
  }
}

export class DeleteProfile implements WatchEvent {
  public constructor()  {}
  public watch(state: GlobalState) {
      return UserService.deleteme().pipe(
        map(() => store.emit(new Logout()))
      )
      
  }
}

export class UpdateProfile implements WatchEvent {
  public constructor(
    private data :UserUpdateDto, 
    private onSuccess,
    private onError
  ) {}
  public watch(state: GlobalState) {
    return UserService.update(this.data).pipe(
      map((data) => {
        this.onSuccess(data);
      }),
      catchError((error) => handleError(this.onError, error))
    );
  }
}

export class RequestNewLoginToken implements WatchEvent {
  public constructor(
    private email :string, 
    private onSuccess,
    private onError
  ) {}
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
  ) {}

  public watch(state: GlobalState) {
    return UserService.loginToken(this.token).pipe(
      map((userData) => {
        if (userData) {
          return new FetchUserData(this.onSuccess, this.onError);
        }
      }),
      catchError((error) => {this.onError(); return of(undefined)})
    );
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

export class CreateInvite implements WatchEvent {
  public constructor(public data: InviteCreateDto) {}

  public watch(state: GlobalState) {
    return UserService.createInvite(this.data).pipe(
      map((data) => {
        store.emit(new FindInvites());
      }),
      catchError((error) => { return  of(undefined)})
    )
  }
}


export class UpdateRole implements WatchEvent {
  public constructor(
    private userId: string,
    private newRole: Role,
    private onSuccess,
    private onError,
  ) {}

  public watch(state: GlobalState) {
    return UserService.updateRole(this.userId,this.newRole).pipe(
      map((data) => {
        this.onSuccess(true)
      }),
      catchError((error) => {  
        return of(undefined);
      }),
    );
  }

}


export class ModerationList implements WatchEvent {
  public constructor(
    private onSuccess = undefined,
  ) {}

  public watch(state: GlobalState) {
    return UserService.moderationList().pipe(
      map((moderationList) => { 
        this.onSuccess(moderationList);
      }),
      catchError((error) => {this.onSuccess([]); return  of(undefined)})
    )
  }
}

export class UnsubscribeMails implements WatchEvent {
  public constructor(
    private email: string,
    private onSuccess,
  ) {}

  public watch(state: GlobalState) {
    return UserService.unsubscribe(this.email).pipe(
      map((data) => {
        this.onSuccess(true)
      }),
      catchError((error) => {
        return of(undefined);
      }),
    );
  }

}

export class FindUserButtons implements WatchEvent {
  public constructor(
    private userId: string,
    private onResult,
  ) {}

  public watch(state: GlobalState) {
    return UserService.findByOwner(this.userId).pipe(
      map((buttonList) => {
        this.onResult(buttonList);
      }),
      catchError((error) => {this.onResult([]); console.log(error); return  of(undefined)})
    )
  }
}

export class FollowTag implements WatchEvent, UpdateEvent {
  public constructor(
    private tag,
    private onSuccess = () => {},
  ) {}

  public watch(state: GlobalState) {
    return UserService.followTag(this.tag).pipe(
      map((userData) => {
        this.onSuccess();
      }),
      catchError((error) => {this.onSuccess(); return  of(undefined)})
    )
  }

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      
      let tags = [...state.loggedInUser.tags]
      if(tags.indexOf(this.tag) > -1)
      {
        return;
      }
      tags.push(this.tag)
      newState.loggedInUser.tags = tags;
    });
  }
}

export function isAdmin(loggedInUser)
{
  if(loggedInUser?.role == 'administrator')
  {
    return true;
  }
  return false;
}

export class GetAdminPhone implements WatchEvent {
  public constructor(
    private userId: string,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return UserService.getPhone(this.userId).pipe(
      map((data) => {
        this.onSuccess(data);
      }),
      catchError((error) => handleError(this.onError, error)),
    );
  }
}