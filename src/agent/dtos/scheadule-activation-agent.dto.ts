import { IsNotEmpty, IsString } from 'class-validator';
export class ScheduleActivationAgentDto {
  @IsNotEmpty()
  @IsString()
  activationStart: string;

  @IsNotEmpty()
  @IsString()
  activationEnd: string;
}
