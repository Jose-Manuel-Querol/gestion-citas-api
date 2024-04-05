import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Day } from './day.entity';
import { Repository } from 'typeorm';
import { CreateDayDto } from './dtos/create-day.dto';
import { AppointmentTypeAgent } from '../appointment-type-agent/appointment-type-agent.entity';

@Injectable()
export class DayService {
  constructor(@InjectRepository(Day) private repo: Repository<Day>) {}

  async getAllByAppointmentTypeAgent(
    appointmentTypeAgentId: number,
  ): Promise<Day[]> {
    return await this.repo.find({
      where: { appointmentTypeAgent: { appointmentTypeAgentId } },
    });
  }

  async getById(dayId: number): Promise<Day> {
    const day = await this.repo.findOne({
      where: { dayId },
    });

    if (!day) {
      throw new NotFoundException('El día no fue encontrado');
    }

    return day;
  }

  async create(
    createDto: CreateDayDto,
    appointmentTypeAgent: AppointmentTypeAgent,
  ): Promise<Day> {
    const day = this.repo.create({
      appointmentTypeAgent,
      active: createDto.active,
      dayName: createDto.dayName,
      endingHour: createDto.endingHour,
      startingHour: createDto.startingHour,
    });

    return await this.repo.save(day);
  }

  async update(dayId: number, attrs: Partial<Day>): Promise<Day> {
    const day = await this.getById(dayId);
    Object.assign(day, attrs);
    return await this.repo.save(day);
  }

  async delete(dayId: number): Promise<Day> {
    const day = await this.getById(dayId);
    await this.repo.remove(day);
    day.dayId = dayId;
    return day;
  }
}
