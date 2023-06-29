import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { configFileName } from '@src/shared/helpers/config-name.const';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    const configs = require(`@src/../../${configFileName}`);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configs.jwtSecret,
      signOptions: { expiresIn: '365d' },
    });
  }

  async validate(payload: any) {
    const user = await this.authService.getCurrentUser(payload.sub);
    return user;
  }
}
