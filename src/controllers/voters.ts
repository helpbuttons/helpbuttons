import {
    AuthorizationContext,
    AuthorizationDecision,
    AuthorizationMetadata,
} from '@loopback/authorization';
import { securityId, UserProfile } from '@loopback/security';
import _ from 'lodash';

export async function onlyAdmin(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
) {
    console.log(authorizationCtx);
    let currentUser: UserProfile;
    if (authorizationCtx.principals.length > 0) {
        const user = _.pick(authorizationCtx.principals[0], [
            'id',
            'name',
            'roles',
        ]);
        currentUser = { [securityId]: user.id, name: user.name, roles: user.roles };
    } else {
        return AuthorizationDecision.DENY;
    }

    if (currentUser.roles.indexOf('admin')) {
        return AuthorizationDecision.ALLOW;
    }

    return AuthorizationDecision.DENY;
}

/**
   * Instance level authorizer for known endpoints
   * - 'projects/{id}/show-balance'
   * - 'projects/{id}/donate'
   * - 'projects/{id}/withdraw'
   * This function is used to modify the authorization context.
   * It is not used for making a decision, so just returns ABSTAIN
   * @param authorizationCtx
   * @param metadata
   */
 export async function onlyOwner(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {
    return AuthorizationDecision.ABSTAIN;
    // let currentUser: UserProfile;
    // if (authorizationCtx.principals.length > 0) {
    //   const user = _.pick(authorizationCtx.principals[0], [
    //     'id',
    //     'name',
    //     'roles',
    //   ]);
    //   currentUser = { [securityId]: user.id, name: user.name, roles: user.roles };
    // } else {
    //   console.log('DENYIING 1');
    //     return AuthorizationDecision.DENY;
    // }
  
    // if (currentUser.roles && currentUser.roles.length > 0 && currentUser.roles.indexOf('admin') !== -1) {
    //   console.log('ALLOW ADMIN!! 1 ')
    //   console.log(currentUser.roles)
    //     return AuthorizationDecision.ALLOW;
    // }

    // console.log('DENYIING 2');
    // return AuthorizationDecision.DENY;
  }

