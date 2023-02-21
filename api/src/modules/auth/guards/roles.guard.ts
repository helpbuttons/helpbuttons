import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@src/shared/types/roles";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        let requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass()
        ])
        const {user, route} = context.switchToHttp().getRequest();

        // console.log(`${JSON.stringify(user)} route: ${route.path} role: ${user.role}`)

        if(requiredRoles.includes(user.role))
        {
            return true;
        }
        return false;
    }
}