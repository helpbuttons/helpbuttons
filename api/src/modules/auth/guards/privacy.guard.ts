import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { HttpStatus } from '@src/shared/types/http-status.enum';

import { NetworkService } from '@src/modules/network/network.service';
import { Observable } from 'rxjs';
import { PrivacyType } from '@src/shared/types/activity.list';

@Injectable()
export class PrivacyGuard implements CanActivate {
  constructor(private readonly networkService: NetworkService) {}

  async getDefaultNetwork() {
    return await this.networkService
      .findDefaultNetwork()
      .then((network) => network);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user, route } = context.switchToHttp().getRequest();
    // console.log('FORBIDDEN')

    return this.getDefaultNetwork().then((defaultNetwork) => {
      // console.log(`network privacy: ${defaultNetwork.privacy}`)
      if (defaultNetwork.privacy == PrivacyType.PRIVATE) {
        // network is private
        if (user) {
          // if user is loggedin...
          return true;
        } else {
          // if not..
          throw new HttpException(
            'private-network',
            HttpStatus.FORBIDDEN,
          );
          return false;
        }
      } else {
        // network is public
        return true;
      }
    });
  }
}
