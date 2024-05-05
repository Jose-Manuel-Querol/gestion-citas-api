import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VacationDay } from './vacation-day.entity';
import { Repository } from 'typeorm';
import { CreateManyVacationDays } from './dtos/create-many-vacation-days.dto';
import { AgentService } from '../agent/agent.service';

@Injectable()
export class VacationDayService {
  constructor(
    @InjectRepository(VacationDay) private repo: Repository<VacationDay>,
    private agentService: AgentService,
  ) {}

  async getAllVacationDayByAgent(agentId: number): Promise<VacationDay[]> {
    return await this.repo.find({ where: { agent: { agentId } } });
  }

  async getOneByDate(vacationDayDate: string): Promise<VacationDay> {
    return await this.repo.findOne({
      where: { vacationDayDate },
    });
  }

  async createMany(createDto: CreateManyVacationDays): Promise<VacationDay[]> {
    const agent = await this.agentService.getById(createDto.agentId);
    const vacationDays: VacationDay[] = [];
    const currentVacationDays = await this.getAllVacationDayByAgent(
      createDto.agentId,
    );
    const currentVacationDayDates = currentVacationDays.map(
      (vacationDay) => vacationDay.vacationDayDate,
    );
    const vacationDaysToDelete = currentVacationDayDates.filter(
      (vacationDay) => {
        !createDto.vacationDayDates.includes(vacationDay);
      },
    );

    if (vacationDaysToDelete.length > 0) {
      for (let i = 0; i < vacationDaysToDelete.length; i++) {
        await this.delete(vacationDaysToDelete[i]);
      }
    }
    for (let i = 0; i < createDto.vacationDayDates.length; i++) {
      if (!currentVacationDayDates.includes(createDto.vacationDayDates[i])) {
        const vacationDay = this.repo.create({
          vacationDayDate: createDto.vacationDayDates[i],
          agent,
        });
        vacationDays.push(vacationDay);
      }
    }

    await this.repo.save(vacationDays);
    return await this.getAllVacationDayByAgent(createDto.agentId);
  }

  async delete(vacationDayDate: string): Promise<VacationDay> {
    const vacationDay = await this.getOneByDate(vacationDayDate);
    return await this.repo.remove(vacationDay);
  }
}
