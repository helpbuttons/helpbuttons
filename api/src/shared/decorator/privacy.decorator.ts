import { applyDecorators, UseGuards } from "@nestjs/common";
import { PrivacyGuard } from "@src/modules/auth/guards/privacy.guard";

export function AllowIfNetworkIsPublic() {    
  return applyDecorators(
    UseGuards(PrivacyGuard)
  );
}