import { applyDecorators, UseGuards } from "@nestjs/common";
import { OptionalJwtAuthGuard } from "@src/modules/auth/guards/optional-jwt-auth.guard.js";
import { PrivacyGuard } from "@src/modules/auth/guards/privacy.guard.js";
import { RolesGuard } from "@src/modules/auth/guards/roles.guard.js";

export function AllowIfNetworkIsPublic() {    
  return applyDecorators(
    UseGuards(OptionalJwtAuthGuard, RolesGuard, PrivacyGuard)
  );
}