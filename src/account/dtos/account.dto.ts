import { Expose, Transform } from 'class-transformer';
import { Role } from '../../role/role.entity';

export class AccountDto {
  @Expose()
  accountId: number;

  @Expose()
  email: string;

  @Expose()
  apiToken: string;

  @Expose()
  resetPasswordToken: string;

  @Expose()
  verificationTokenExpiration: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  @Transform(({ obj }) => obj.role)
  role: Role;
}
