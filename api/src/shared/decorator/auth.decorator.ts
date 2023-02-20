import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@src/modules/auth/guards/roles.guard';

// export function Auth(...roles: Role[]) {
export function Auth() {    
  return applyDecorators(
    // SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth()
  );
}
