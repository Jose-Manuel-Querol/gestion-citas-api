import { ApiProperty } from '@nestjs/swagger';
import { Zone } from '../../zone/zone.entity';
import { ZoneExampleDto } from './zone.example.dto';

export class AgentExampleDto {
  @ApiProperty({
    example: 1,
    description: 'El ID del agente',
  })
  agentId: number;

  @ApiProperty({
    example: 'Stephano',
    description: 'Nombres del agente',
  })
  firstName: string;

  @ApiProperty({
    example: 'Palomino',
    description: 'Apellidos del agente',
  })
  lastName: string;

  @ApiProperty({
    example: 'test-test',
    description: 'Slug del agente',
  })
  slug: string;

  @ApiProperty({
    example: 'test@email.com',
    description: 'Correo electrónico del agente',
  })
  email: string;

  @ApiProperty({
    example: 'Madrid',
    description: 'Ciudad donde vive el agente',
  })
  city: string;

  @ApiProperty({
    example: '12345678',
    description: 'Número de dni del agente',
  })
  dni: string;

  @ApiProperty({
    example: '9876665544',
    description: 'Número de celular del agente',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'CALLE AGUSTINA DE ARAGON',
    description: 'Dirección del agente',
  })
  address: string;

  @ApiProperty({
    example: '111',
    description: 'Número de la dirección del agente',
  })
  addressNro: string;

  @ApiProperty({
    example: 'CALLE AGUSTINA DE ARAGON 111',
    description: 'Dirección completa del agente',
  })
  fullAddress: string;

  @ApiProperty({
    example: '2024-04-03T00:00:00.000Z',
    description: 'Fecha en la cual empiezan las vacaciones del agente',
  })
  vacationStart: string;

  @ApiProperty({
    example: '2024-04-10T05:00:00.000Z',
    description: 'Fecha en la cual acaban las vacaciones del agente',
  })
  vacationEnd: string;

  @ApiProperty({
    example: true,
    description: 'Determina si el agente está de vacaciones',
  })
  vacation: boolean;

  @ApiProperty({
    example: true,
    description: 'Determina si el agente esta activo o no',
  })
  active: boolean;

  @ApiProperty({
    example: '2024-04-03T00:00:00.000Z',
    description: 'Fecha en al cual el agente se vuelve inactivo',
  })
  activationStart: string;

  @ApiProperty({
    example: '2024-04-10T05:00:00.000Z',
    description: 'Fecha en al cual el agente vuelve a estar activo',
  })
  activationEnd: string;

  @ApiProperty({
    type: ZoneExampleDto,
    description: 'Zona del agente',
  })
  zone: Zone;
}
