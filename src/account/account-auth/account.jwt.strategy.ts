import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AccountService } from '../account.service';

@Injectable()
export class AccountJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-account',
) {
  constructor(
    private configService: ConfigService,
    private accountService: AccountService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_ACCOUNT'),
    });
  }

  async validate(payload: any) {
    const account = await this.accountService.getById(payload.sub);
    return {
      id: payload.sub,
      roles: account.rolesAccount.map(
        (roleAccount) => roleAccount.role.roleName,
      ),
    };
  }
}
