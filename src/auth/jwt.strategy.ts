import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/entity/user.entity';
import { JWTPayload } from '../interfaces/api-interfaces';
import { responseToInterface } from '../helpers/return-utils';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JWTPayload): Promise<JWTPayload> {
    const user: User = await this.authService.validateUser(payload.userId);
    if (!user){
      throw new UnauthorizedException(responseToInterface(
        null, false, 'Invalid access token.'
      ));
    }
    return { userId: payload.userId }
  }
}
