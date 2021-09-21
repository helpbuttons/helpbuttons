import { AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer } from "@loopback/authorization";
import { Provider } from "@loopback/core";
// 
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
      console.log(JSON.stringify(context));
      console.log('metadata: ')
      console.log(JSON.stringify(metadata));
      // events.push(context.resource);
      if (
        context.resource === 'OrderController.prototype.cancelOrder' &&
        context.principals[0].name === 'user-01'
      ) {
        return AuthorizationDecision.ALLOW;
      }
      return AuthorizationDecision.DENY;
    }
  }
  