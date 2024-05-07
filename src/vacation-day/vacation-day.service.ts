import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VacationDay } from './vacation-day.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateManyVacationDays } from './dtos/create-many-vacation-days.dto';
import { UpdateVacationDto } from './dtos/update-vacation.dto';
import { Agent } from '../agent/agent.entity';
import { CreateManyVacationDaysWithAgent } from './dtos/create-many-vacation-days-with-agent.dto';
import { AgentService } from '../agent/agent.service';

@Injectable()
export class VacationDayService {
  constructor(
    @InjectRepository(VacationDay) private repo: Repository<VacationDay>,
    @Inject(forwardRef(() => AgentService))
    private agentService: AgentService,
  ) {}

  async getAllVacationDayByAgent(agentId: number): Promise<VacationDay[]> {
    return await this.repo.find({ where: { agent: { agentId } } });
  }

  async getAllVacationDayByAgentAndAvailable(
    agentId: number,
    currentDate: string,
  ): Promise<VacationDay[]> {
    return await this.repo.find({
      where: {
        agent: { agentId },
        vacationDayDate: MoreThanOrEqual(currentDate),
      },
    });
  }

  async getOneByDate(vacationDayDate: string): Promise<VacationDay> {
    return await this.repo.findOne({
      where: { vacationDayDate },
      relations: { agent: true },
    });
  }

  async getAllByDate(vacationDayDate: string): Promise<VacationDay[]> {
    return await this.repo.find({
      where: { vacationDayDate },
    });
  }

  async getOneById(vacationDayId: number): Promise<VacationDay> {
    const vacationDay = await this.repo.findOne({
      where: { vacationDayId },
      relations: { agent: true },
    });

    if (!vacationDay) {
      throw new NotFoundException('No se encontró el día');
    }

    return vacationDay;
  }

  async createMany(
    createDto: CreateManyVacationDays,
    agent: Agent,
  ): Promise<VacationDay[]> {
    const vacationDays: VacationDay[] = [];
    /*const currentVacationDays = await this.getAllVacationDayByAgent(
      createDto.agentId,
    );
    const currentVacationDayDates = currentVacationDays.map(
      (vacationDay) => vacationDay.vacationDayDate,
    );
    const vacationDaysToDelete = currentVacationDayDates.filter(
      (vacationDay) => !createDto.vacationDayDates.includes(vacationDay),
    );

    if (vacationDaysToDelete.length > 0) {
      for (let i = 0; i < vacationDaysToDelete.length; i++) {
        await this.delete(vacationDaysToDelete[i]);
      }
    }*/
    for (let i = 0; i < createDto.vacationDayDates.length; i++) {
      const foundDate = await this.getAllVacationDayByAgentAndAvailable(
        agent.agentId,
        createDto.vacationDayDates[i],
      );
      if (foundDate.length > 0) {
        throw new BadRequestException(
          `Usted ya creó una día festivo con la fecha ${createDto.vacationDayDates[i]}`,
        );
      }
      const vacationDay = this.repo.create({
        vacationDayDate: createDto.vacationDayDates[i],
        agent,
      });
      vacationDays.push(vacationDay);
    }

    await this.repo.save(vacationDays);
    return await this.getAllVacationDayByAgent(agent.agentId);
  }

  async createNewMany(
    createDto: CreateManyVacationDaysWithAgent,
  ): Promise<VacationDay[]> {
    const vacationDays: VacationDay[] = [];
    /*const currentVacationDays = await this.getAllVacationDayByAgent(
      createDto.agentId,
    );
    const currentVacationDayDates = currentVacationDays.map(
      (vacationDay) => vacationDay.vacationDayDate,
    );
    const vacationDaysToDelete = currentVacationDayDates.filter(
      (vacationDay) => !createDto.vacationDayDates.includes(vacationDay),
    );

    if (vacationDaysToDelete.length > 0) {
      for (let i = 0; i < vacationDaysToDelete.length; i++) {
        await this.delete(vacationDaysToDelete[i]);
      }
    }*/
    const agent = await this.agentService.getById(createDto.agentId);
    for (let i = 0; i < createDto.vacationDayDates.length; i++) {
      const foundDate = await this.getAllVacationDayByAgentAndAvailable(
        agent.agentId,
        createDto.vacationDayDates[i],
      );
      if (foundDate.length > 0) {
        throw new BadRequestException(
          `Usted ya creó una día festivo con la fecha ${createDto.vacationDayDates[i]}`,
        );
      }
      const vacationDay = this.repo.create({
        vacationDayDate: createDto.vacationDayDates[i],
        agent,
      });
      vacationDays.push(vacationDay);
    }

    await this.repo.save(vacationDays);
    return await this.getAllVacationDayByAgent(agent.agentId);
  }

  async update(
    vacationDayId: number,
    updateDto: UpdateVacationDto,
  ): Promise<VacationDay> {
    const vacationDay = await this.getOneById(vacationDayId);
    vacationDay.vacationDayDate = updateDto.vacationDayDate;
    return await this.repo.save(vacationDay);
  }

  async delete(vacationDayId: number): Promise<VacationDay> {
    const vacationDay = await this.getOneById(vacationDayId);
    return await this.repo.remove(vacationDay);
  }
}
