import { IsNotEmpty, IsString } from 'class-validator';
export class CreateZoneDto {
  @IsNotEmpty()
  @IsString()
  zoneName: string;
}
