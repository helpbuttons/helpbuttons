import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NetworkService } from '@src/modules/network/network.service.js';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    return user;
  }
}
