import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Franja } from './franja.entity';
import { Repository } from 'typeorm';
import { Day } from '../day/day.entity';
import { CreateFranjaDto } from './dtos/create-franja.dto';

@Injectable()
export class FranjaService {
  constructor(@InjectRepository(Franja) private repo: Repository<Franja>) {}

  async getAllByDay(dayId: number): Promise<Franja[]> {
    return await this.repo.find({
      where: { day: { dayId } },
      relations: { day: true },
    });
  }

  async getById(franjaId: number): Promise<Franja> {
    const franja = await this.repo.findOne({
      where: { franjaId },
      relations: { day: true },
    });

    if (!franja) {
      throw new NotFoundException('La franja horaria no fue encontrada');
    }

    return franja;
  }

  async getByFranja(createDto: CreateFranjaDto, day: Day): Promise<Franja[]> {
    return await this.repo.find({
      where: {
        day: { dayId: day.dayId },
        startingHour: createDto.startingHour,
        endingHour: createDto.endingHour,
      },
    });
  }

  async create(createDto: CreateFranjaDto, day: Day): Promise<Franja> {
    const franjas = await this.getByFranja(createDto, day);
    if (franjas.length > 0) {
      throw new BadRequestException(
        `Ha agregado dos franjas horarias identicas al día ${day.dayName} del tipo de cita ${day.appointmentTypeAgent.appointmentType.typeName}. 
        No puede agregar la misma franja de tiempo al mismo día`,
      );
    }
    const franja = this.repo.create({
      day,
      endingHour: createDto.endingHour,
      startingHour: createDto.startingHour,
    });

    return await this.repo.save(franja);
  }

  async update(franjaId: number, attrs: Partial<Franja>): Promise<Franja> {
    const franja = await this.getById(franjaId);
    Object.assign(franja, attrs);
    return await this.repo.save(franja);
  }

  async delete(franjaId: number): Promise<Franja> {
    const franja = await this.getById(franjaId);
    await this.repo.remove(franja);
    franja.franjaId = franjaId;
    return franja;
  }
}
