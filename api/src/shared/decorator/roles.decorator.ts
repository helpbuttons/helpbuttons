import { applyDecorators, ClassSerializerInterceptor, SetMetadata, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Role } from "../types/roles";
import { Auth } from "./auth.decorator";

export const AllowedRoles = (roles: Role[]) => SetMetadata('roles', roles)

export function AllowGuest() {    
    return applyDecorators(
        Auth(),
        AllowedRoles([Role.guest, Role.registered, Role.admin]),
        UseInterceptors(ClassSerializerInterceptor)
    );
}

export function OnlyRegistered() {    
    return applyDecorators(
        Auth(),
        AllowedRoles([Role.registered, Role.admin])
    );
}

export function OnlyAdmin() {
    return applyDecorators(
        Auth(),
        AllowedRoles([Role.admin])
    );
}