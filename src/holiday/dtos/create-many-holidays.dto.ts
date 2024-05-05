import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateManyHoliday {
  @IsArray()
  @IsNotEmpty()
  holidayDates: string[];
}
