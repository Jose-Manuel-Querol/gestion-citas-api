import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AccountService } from '../account.service';

@Injectable()
export class AccountLocalStrategy extends PassportStrategy(
  Strategy,
  'local-account',
) {
  constructor(private accountService: AccountService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string) {
    const user = await this.accountService.loginAccount(email, password);
    if (!user) {
      throw new UnauthorizedException('Error, la información es incorrecta');
    }

    return user;
  }
}
