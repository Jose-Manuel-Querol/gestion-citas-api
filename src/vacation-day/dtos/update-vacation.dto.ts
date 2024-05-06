import { IsNumber, IsString } from 'class-validator';

export class UpdateVacationDto {
  @IsString()
  vacationDayDate: string;

  @IsNumber()
  agentId: number;
}
