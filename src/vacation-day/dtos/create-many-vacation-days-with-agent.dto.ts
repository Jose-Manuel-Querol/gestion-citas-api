import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateManyVacationDaysWithAgent {
  @IsArray()
  @IsNotEmpty()
  vacationDayDates: string[];

  @IsNotEmpty()
  @IsNumber()
  agentId: number;
}
