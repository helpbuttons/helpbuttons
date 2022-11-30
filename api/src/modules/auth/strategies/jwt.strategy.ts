import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import webAppConfig from '@src/app/configs/web-app.config';
import { WebAppConfigs } from '@src/app/types/web.type';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService, 
    @Inject(webAppConfig.KEY)
    private readonly webAppConfigs: ConfigType<typeof webAppConfig>,) {
      // const webAppConfigs = app.get<ConfigType<typeof webAppConfig>>(
        // webAppConfig.KEY,
      // );
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: webAppConfigs.jwtSecret,
      signOptions: { expiresIn: '365d' },
    });
  }

  async validate(payload: any) {
    
    const user = await this.authService.getCurrentUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
