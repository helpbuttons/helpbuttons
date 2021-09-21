import { AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer } from "@loopback/authorization";
import { Provider } from "@loopback/core";

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

      let decidedToAllow = false;
      if (metadata.allowedRoles){
        metadata.allowedRoles.forEach(allowedRole => {
          context.roles.forEach(userRole => {
            if (allowedRole.toString() === userRole.name) {
              decidedToAllow = true;
            }
          });
        });
      }

      if (decidedToAllow) {
        return AuthorizationDecision.ALLOW;
      }
      return AuthorizationDecision.DENY;
    }
  }
  