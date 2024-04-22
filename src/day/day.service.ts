import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Day } from './day.entity';
import { Repository } from 'typeorm';
import { CreateDayDto } from './dtos/create-day.dto';
import { AppointmentTypeAgent } from '../appointment-type-agent/appointment-type-agent.entity';
import { FranjaService } from '../franja/franja.service';
import { DayDto } from './dtos/day.dto';
@Injectable()
export class DayService {
  constructor(
    @InjectRepository(Day) private repo: Repository<Day>,
    private franjaService: FranjaService,
  ) {}

  async getAllByAppointmentTypeAgent(
    appointmentTypeAgentId: number,
  ): Promise<Day[]> {
    return await this.repo.find({
      where: { appointmentTypeAgent: { appointmentTypeAgentId } },
      relations: { appointmentTypeAgent: true, franjas: true },
    });
  }

  async getById(dayId: number): Promise<Day> {
    const day = await this.repo.findOne({
      where: { dayId },
      relations: { appointmentTypeAgent: true, franjas: true },
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
      .leftJoinAndSelect('agent.zone', 'zone')
      .leftJoinAndSelect('day.franjas', 'franja')
      .where('appointmentType.appointmentTypeId = :appointmentTypeId', {
        appointmentTypeId,
      })
      .andWhere('day.dayName IN (:...dayNames)', { dayNames })
      .andWhere('agent.vacation = :vacation', {
        vacation: false,
      })
      .andWhere('agent.active = :active', {
        active: true,
      });

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
    });

    const savedDay = await this.repo.save(day);
    for (let i = 0; i < createDto.franjas.length; i++) {
      await this.franjaService.create(createDto.franjas[i], savedDay);
    }

    return await this.getById(savedDay.dayId);
  }

  async update(dayId: number, updateDto: DayDto): Promise<Day> {
    const day = await this.getById(dayId);
    if (updateDto.active) {
      day.active = updateDto.active;
    }

    if (updateDto.dayName) {
      day.dayName = updateDto.dayName;
    }

    const updatedDay = await this.repo.save(day);

    if (updateDto.franjas.length > 0) {
      const franjas = updatedDay.franjas;
      const currentFranjaIds = franjas.map((franja) => franja.franjaId);
      const newFranjaIds = updateDto.franjas.map((franja) => franja.franjaId);
      const franjaIdsToDelete = currentFranjaIds.filter(
        (franjaId) => !newFranjaIds.includes(franjaId),
      );

      if (franjaIdsToDelete.length > 0) {
        for (let f = 0; f < franjaIdsToDelete.length; f++) {
          await this.franjaService.delete(franjaIdsToDelete[f]);
        }
      }

      for (let e = 0; e < updateDto.franjas.length; e++) {
        if (updateDto.franjas[e].franjaId) {
          await this.franjaService.update(
            updateDto.franjas[e].franjaId,
            updateDto.franjas[e],
          );
        } else {
          await this.franjaService.create(
            {
              endingHour: updateDto.franjas[e].endingHour,
              startingHour: updateDto.franjas[e].startingHour,
            },
            updatedDay,
          );
        }
      }
    }
    return await this.getById(updatedDay.dayId);
  }

  async delete(dayId: number): Promise<Day> {
    const day = await this.getById(dayId);
    await this.repo.remove(day);
    day.dayId = dayId;
    return day;
  }
}
