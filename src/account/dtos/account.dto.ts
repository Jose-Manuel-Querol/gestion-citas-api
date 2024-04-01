import { Expose } from 'class-transformer';

export class AccountDto {
  @Expose()
  accountId: number;

  @Expose()
  email: string;

  @Expose()
  resetPasswordToken: string;

  @Expose()
  verificationTokenExpiration: Date;

  @Expose()
  createdAt: Date;
}
