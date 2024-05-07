import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateManyVacationDays {
  @IsArray()
  @IsNotEmpty()
  vacationDayDates: string[];
}
