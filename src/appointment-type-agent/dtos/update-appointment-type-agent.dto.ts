import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { DayDto } from '../../day/dtos/day.dto';

export class UpdateAppointmentTypeAgent {
  @IsOptional()
  @IsNumber()
  appointmentTypeAgentId: number;

  @IsNotEmpty()
  @IsNumber()
  appointmentTypeId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayDto)
  days: DayDto[];
}
