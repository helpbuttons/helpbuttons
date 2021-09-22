import { AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer } from "@loopback/authorization";
import { Provider } from "@loopback/core";
import { securityId, UserProfile } from '@loopback/security';
import _ from 'lodash';

export class AuthorizationProvider implements Provider<Authorizer> {
  /**
   * @returns an authorizer function
   *
   */
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    context: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {
    return AuthorizationDecision.ABSTAIN;
    // console.log(metadata);
    // let RBAC_PERMISSIONS = [{
    //   'name': 'ButtonController.prototype.create',
    //   'arg': '0',
    //   'needsToBe': 'owner',
    //   'ofObject': 'network'
    // }];
    // let resourceId = context.invocationContext.args[0];
    // let methodName = context.invocationContext.methodName;
    // console.log(context.invocationContext.targetName)
    // // let resourceName = context.invocationContext.

    // let perms = RBAC_PERMISSIONS.find((permission) => {
    //   return (permission.name == context.invocationContext.targetName);
    // });

    // console.log(perms);

    // let decidedToAllow = false;
    // if (metadata.allowedRoles) {
    //   if (metadata.allowedRoles.indexOf('guest') > -1) {
    //     decidedToAllow = true;
    //   } else {
    //     metadata.allowedRoles.forEach(allowedRole => {
    //       context.roles.forEach(userRole => {
    //         if (allowedRole.toString() === userRole.name) {
    //           decidedToAllow = true;
    //         }
    //       });
    //     });
    //   }
    // }

    // if (decidedToAllow) {
    //   console.log('ALLOOWWING 2 ')
    //   // return AuthorizationDecision.ALLOW;
    // }
    // // return AuthorizationDecision.DENY;

    let currentUser: UserProfile;
    if (context.principals.length > 0) {
      const user = _.pick(context.principals[0], [
        'id',
        'name',
        'roles',
      ]);
      currentUser = { [securityId]: user.id, name: user.name, roles: user.roles };
    } else {
      return AuthorizationDecision.DENY;
    }

    if (currentUser.roles.indexOf('admin'))
    {
      return AuthorizationDecision.ALLOW;
    }

    if (currentUser[securityId] === context.invocationContext.args[0]) {
      return AuthorizationDecision.ALLOW;
    }

    return AuthorizationDecision.DENY;
  }
}