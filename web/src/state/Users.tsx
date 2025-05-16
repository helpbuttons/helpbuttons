import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { produce } from 'immer';

import { WatchEvent, UpdateEvent, EffectEvent } from 'store/Event';

import { IUser } from 'services/Users/types';
import { UserService } from 'services/Users';

import { HttpService, isHttpError } from 'services/HttpService';
import { SignupQRRequestDto, SignupRequestDto } from 'shared/dtos/auth.dto';
import { GlobalState, store } from 'state';
import { HttpStatus } from 'shared/types/http-status.enum';
import { handleError } from './helper';
import { UserUpdateDto } from 'shared/dtos/user.dto';
import { ButtonService } from 'services/Buttons';
import { Role } from 'shared/types/roles';
import { Invite } from 'shared/entities/invite.entity';
import { InviteCreateDto } from 'shared/dtos/invite.dto';
import { activitiesInitialState } from './Activity';
import dconsole from 'shared/debugger';

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
    private page: number = 0,
    private onSuccess = undefined,
  ) {}

  public watch(state: GlobalState) {
    return UserService.moderationList(this.page).pipe(
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
      catchError((error) => {this.onResult([]); dconsole.log(error); return  of(undefined)})
    )
  }
}



export function isAdmin(sessionUser)
{
  if(sessionUser?.role == 'administrator')
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


export class GetPhone implements WatchEvent {
  public constructor(
    private userId: string,
    private onSuccess,
    private onError,
  ) { }
  public watch(state: GlobalState) {
    return UserService.getPhone(this.userId).pipe(
      map((data) => {
        this.onSuccess(data);
      }),
      catchError((error) => handleError(this.onError, error)),
    );
  }
}


export class SetSignupTags implements UpdateEvent{
  public constructor(private tags: string[]) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.signupTags = this.tags;
    });
  }
}


export class UserEndorse implements WatchEvent, UpdateEvent {
  public constructor(
    private userId: string,
  ) {}
  public watch(state: GlobalState) {
    return UserService.endorse(this.userId)
  }
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      // if(newState.homeInfo.mainPopupUserProfile)
      // {
      //   newState.homeInfo.mainPopupUserProfile.endorsed = true
      // }
    });
  }
}

export class UserRevokeEndorse implements WatchEvent, UpdateEvent {
  public constructor(
    private userId: string,
  ) {}
  public watch(state: GlobalState) {
    return UserService.revokeEndorse(this.userId)
  }
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      // if(newState.homeInfo.mainPopupUserProfile)
      // {
      //   newState.homeInfo.mainPopupUserProfile.endorsed = false
      // }
      
    });
  }
}

