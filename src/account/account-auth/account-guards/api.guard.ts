import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccountService } from '../../account.service';

@Injectable()
export class ApiGuard implements CanActivate {
  constructor(private accountService: AccountService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1]; // Bearer Token

    if (!token) {
      return false;
    }

    return this.validateToken(token);
  }

  async validateToken(token: string): Promise<boolean> {
    const account = await this.accountService.getAccountByToken(token);
    return !!account;
  }
}
