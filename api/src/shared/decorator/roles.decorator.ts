import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "@src/modules/auth/guards/jwt-auth.guard";
import { Role } from "../types/roles";
import { Auth } from "./auth.decorator";

export const AllowedRoles = (roles: Role[]) => SetMetadata('roles', roles)

export function AllowGuest() {    
    return applyDecorators(
        AllowedRoles([Role.guest, Role.registered, Role.admin])
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