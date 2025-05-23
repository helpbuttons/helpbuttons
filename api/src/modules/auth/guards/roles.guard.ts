import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CustomHttpException } from '@src/shared/middlewares/errors/custom-http-exception.middleware.js';
import { ErrorName } from '@src/shared/types/error.list.js';
import { Role } from '@src/shared/types/roles.js';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    const { user, route } = context.switchToHttp().getRequest();

    // console.log(`${JSON.stringify(user)} route: ${route.path} role: ${user.role}`)
    let userRole = Role.guest;
    if (user && user.role) {
      userRole = user.role;
    }
    if (!requiredRoles) {
      return true;
    }

    if (requiredRoles.includes(userRole)) {
      return true;
    }
    throw new CustomHttpException(ErrorName.NeedToBeRegistered);
    
  }
}
