import { Expose } from 'class-transformer';

export class VerificationValidatedToken {
  @Expose()
  validated: boolean;
}
