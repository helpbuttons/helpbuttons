import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from '@src/modules/auth/guards/optional-jwt-auth.guard.js';
import { RolesGuard } from '@src/modules/auth/guards/roles.guard.js';

// export function Auth(...roles: Role[]) {
export function Auth() {    
  return applyDecorators(
    // SetMetadata('roles', roles),
    UseGuards(OptionalJwtAuthGuard, RolesGuard),
    ApiBearerAuth()
  );
}
