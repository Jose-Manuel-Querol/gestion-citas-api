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
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dayNames = [];
    let count = 0;

    // Use a loop to find the next 4 valid weekdays based on current day
    while (dayNames.length < 4) {
      const tempDate = new Date(today);
      tempDate.setDate(today.getDate() + count);
      const dayOfWeek = tempDate.toLocaleString('en-US', { weekday: 'long' });
      if (validDays.includes(dayOfWeek)) {
        dayNames.push(this.mapDayEnglishToSpanish(dayOfWeek));
      }
      count++;
    }

    const query = this.repo
      .createQueryBuilder('day')
      .leftJoinAndSelect('day.appointmentTypeAgent', 'appointmentTypeAgent')
      .leftJoinAndSelect(
        'appointmentTypeAgent.appointmentType',
        'appointmentType',
      )
      .leftJoinAndSelect('appointmentTypeAgent.agent', 'agent')
      .where('appointmentType.appointmentTypeId = :appointmentTypeId', {
        appointmentTypeId,
      })
      .andWhere('day.dayName IN (:...dayNames)', { dayNames });

    const days = await query.getMany();
    return days;
  }

  // Helper function to map English weekday names to Spanish
  mapDayEnglishToSpanish(dayName: string): string {
    const dayNameMap = {
      Monday: 'Lunes',
      Tuesday: 'Martes',
      Wednesday: 'Miércoles',
      Thursday: 'Jueves',
      Friday: 'Viernes',
    };
    return dayNameMap[dayName];
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
