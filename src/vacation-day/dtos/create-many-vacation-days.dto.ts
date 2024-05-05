import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateManyVacationDays {
  @IsArray()
  @IsNotEmpty()
  vacationDayDates: string[];

  @IsNumber()
  @IsNotEmpty()
  agentId: number;
}
