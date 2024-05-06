import { IsString } from 'class-validator';

export class HolidayDto {
  @IsString()
  holidayDate: string;
}
