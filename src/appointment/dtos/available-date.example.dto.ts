import { ApiProperty } from '@nestjs/swagger';
import { Day } from '../../day/day.entity';
import { LocationExampleDto } from './location.example.dto';
import { DayExampleDto } from './day.example.dto';
import { Location } from '../../location/location.entity';

export class AvailableDatesExampleDto {
  @ApiProperty({
    example: '2024-05-03T05:00:00.000Z',
    description: 'Fecha de la cita',
  })
  date: string;

  @ApiProperty({
    type: LocationExampleDto,
    description: 'Ubicación de la Cita',
  })
  location: Location;

  @ApiProperty({
    type: DayExampleDto,
    description: 'Día de la cita',
  })
  day: Day;

  @ApiProperty({
    example: [
      '12:30 to 13:00',
      '13:30 to 14:00',
      '17:00 to 17:30',
      '18:00 to 18:30',
      '19:00 to 19:30',
    ],
    description: 'Horarios disponibles',
  })
  availableSlots: string[];
}
