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

  async filterDaysAndAgents(appointmentTypeId: number): Promise<Day[]> {
    const today = new Date();
    // Map of English to Spanish day names
    const dayNameMap = {
      Monday: 'Lunes',
      Tuesday: 'Martes',
      Wednesday: 'Miércoles',
      Thursday: 'Jueves',
      Friday: 'Viernes',
    };

    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dayNames = [];

    // Collect Spanish names for the next 4 valid days
    for (let i = 0; i < 4; i++) {
      const tempDate = new Date(today);
      tempDate.setDate(tempDate.getDate() + i);
      const dayOfWeek = tempDate.toLocaleString('en-US', { weekday: 'long' });
      if (validDays.includes(dayOfWeek)) {
        dayNames.push(dayNameMap[dayOfWeek]); // Push Spanish day name
      }
    }

    const query = this.repo
      .createQueryBuilder('day')
      .leftJoinAndSelect('day.appointmentTypeAgent', 'appointmentTypeAgent')
      .leftJoinAndSelect(
        'appointmentTypeAgent.appointmentType',
        'appointmentType',
      )
      .where('appointmentType.appointmentTypeId = :appointmentTypeId', {
        appointmentTypeId,
      })
      .andWhere('day.dayName IN (:...dayNames)', { dayNames });

    const days = await query.getMany();
    return days;
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
