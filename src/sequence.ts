import { MiddlewareSequence } from '@loopback/rest';

import {
    AuthenticateFn,
    AuthenticationBindings,
    AUTHENTICATION_STRATEGY_NOT_FOUND,
    USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';

export class MySequence extends MiddlewareSequence { 
    
}

