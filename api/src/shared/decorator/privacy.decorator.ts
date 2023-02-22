import { applyDecorators, UseGuards } from "@nestjs/common";
import { OptionalJwtAuthGuard } from "@src/modules/auth/guards/optional-jwt-auth.guard";
import { PrivacyGuard } from "@src/modules/auth/guards/privacy.guard";
import { RolesGuard } from "@src/modules/auth/guards/roles.guard";

export function AllowIfNetworkIsPublic() {    
  return applyDecorators(
    UseGuards(OptionalJwtAuthGuard, RolesGuard, PrivacyGuard)
  );
}