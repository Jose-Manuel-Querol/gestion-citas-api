import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from './agent.entity';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { ZoneService } from '../zone/zone.service';
import { CreateAgentDto } from './dtos/create-agent.dto';
import { UpdateAgentDto } from './dtos/update-agent.dto';
import { generateSlug } from '../shared/shared-functions';
import { AppointmentTypeAgentService } from '../appointment-type-agent/appointment-type-agent.service';
import { ScheduleActivationAgentDto } from './dtos/scheadule-activation-agent.dto';
import { AccountService } from '../account/account.service';
import { UpdateAccountDto } from '../account/dtos/update-account.dto';
import { VacationDayService } from '../vacation-day/vacation-day.service';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent) private repo: Repository<Agent>,
    private zoneService: ZoneService,
    private appointmentTypeAgentService: AppointmentTypeAgentService,
    @Inject(forwardRef(() => AccountService))
    private accountService: AccountService,
    @Inject(forwardRef(() => VacationDayService))
    private vacationDayService: VacationDayService,
  ) {}

  async getAll(): Promise<Agent[]> {
    return await this.repo.find({
      relations: {
        zone: true,
        appointmentTypeAgents: {
          appointmentType: true,
          days: { franjas: true },
        },
      },
    });
  }

  async getAllBySlug(slug: string): Promise<Agent[]> {
    return await this.repo.find({
      where: { slug },
      relations: {
        zone: true,
        appointmentTypeAgents: {
          appointmentType: true,
          days: { franjas: true },
        },
      },
    });
  }

  async getById(agentId: number): Promise<Agent> {
    const agent = await this.repo.findOne({
      where: { agentId },
      relations: {
        zone: true,
        appointmentTypeAgents: {
          appointmentType: true,
          days: { franjas: true },
        },
        account: true,
      },
    });
    if (!agent) {
      throw new NotFoundException('El agente no fue encontrado');
    }

    return agent;
  }

  async getByEmail(email: string): Promise<Agent> {
    const agent = await this.repo.findOne({
      where: { email },
      relations: {
        zone: true,
        appointmentTypeAgents: {
          appointmentType: true,
          days: { franjas: true },
        },
      },
    });
    if (!agent) {
      throw new NotFoundException(
        'No se encontro ningún agente con ese correo electrónico',
      );
    }

    return agent;
  }

  async getAllByEmail(email: string): Promise<Agent[]> {
    const agents = await this.repo.find({
      where: { email },
      relations: {
        zone: true,
        appointmentTypeAgents: {
          appointmentType: true,
          days: { franjas: true },
        },
        vacationDays: true,
      },
    });

    return agents;
  }

  async getAgentByAccountId(accountId: number): Promise<Agent> {
    const agent = await this.repo.findOne({
      where: {
        account: { accountId },
      },
    });

    if (!agent) {
      throw new NotFoundException('El agente no fue encontrado');
    }

    return agent;
  }

  async getBySlug(slug: string): Promise<Agent> {
    const agent = await this.repo.findOne({
      where: { slug },
      relations: {
        zone: true,
        appointmentTypeAgents: {
          appointmentType: true,
          days: { franjas: true },
        },
        vacationDays: true,
      },
    });
    if (!agent) {
      throw new NotFoundException('El agente no fue encontrado');
    }

    return agent;
  }

  async activate(agentId: number): Promise<Agent> {
    const agent = await this.getById(agentId);
    agent.active = true;
    agent.activationStart = null;
    agent.activationEnd = null;
    return await this.repo.save(agent);
  }

  async deactivate(agentId: number): Promise<Agent> {
    const agent = await this.getById(agentId);
    agent.active = false;
    return await this.repo.save(agent);
  }

  async create(createDto: CreateAgentDto): Promise<Agent> {
    const zone = await this.zoneService.getById(createDto.zoneId);
    const foundAgents = await this.getAllByEmail(createDto.email);
    if (foundAgents.length > 0) {
      throw new BadRequestException(
        'Ya existe otro agente con el mismo correo electrónico',
      );
    }
    const agent = this.repo.create({
      email: createDto.email,
      firstName: createDto.firstName,
      lastName: createDto.lastName,
      zone,
    });

    if (createDto.address && createDto.addressNro) {
      agent.address = createDto.address;
      agent.addressNro = createDto.addressNro;
      agent.fullAddress = createDto.address + ' ' + createDto.addressNro;
    }

    if (createDto.city) {
      agent.city = createDto.city;
    }

    if (createDto.dni) {
      agent.dni = createDto.dni;
    }

    if (createDto.phoneNumber) {
      agent.phoneNumber = createDto.phoneNumber;
    }

    let baseSlug = generateSlug(createDto.firstName + ' ' + createDto.lastName);
    let agents = await this.getAllBySlug(baseSlug);
    while (agents.length > 0) {
      const randomDigit = Math.floor(Math.random() * 100);
      baseSlug = `${baseSlug}${randomDigit}`;
      agents = await this.getAllBySlug(baseSlug);
    }
    agent.slug = baseSlug;

    const createdAgent = await this.repo.save(agent);
    await this.appointmentTypeAgentService.createMany(
      createDto.appointmentTypeAgents,
      createdAgent,
    );
    if (
      createDto.vacationDays &&
      createDto.vacationDays.vacationDayDates &&
      createDto.vacationDays.vacationDayDates.length > 0
    ) {
      await this.vacationDayService.createMany(
        createDto.vacationDays,
        createdAgent,
      );
    }

    return await this.getById(createdAgent.agentId);
  }

  async deactivateAgent(
    agentId: number,
    updateDto: ScheduleActivationAgentDto,
  ): Promise<Agent> {
    const agent = await this.getById(agentId);
    agent.activationStart = updateDto.activationStart;
    agent.activationEnd = updateDto.activationEnd;
    await this.repo.save(agent);
    return await this.getById(agentId);
  }

  async update(agentId: number, updateDto: UpdateAgentDto): Promise<Agent> {
    console.log('updateDto', updateDto);
    const agent = await this.getById(agentId);
    agent.fullAddress = updateDto.address + ' ' + updateDto.addressNro;
    agent.address = updateDto.address;
    agent.addressNro = updateDto.addressNro;
    agent.city = updateDto.city;
    agent.email = updateDto.email;
    const updatedAccount: UpdateAccountDto = { email: updateDto.email };
    await this.accountService.updateAccount(
      agent.account.accountId,
      updatedAccount,
    );
    agent.firstName = updateDto.firstName;
    agent.lastName = updateDto.lastName;
    agent.phoneNumber = updateDto.phoneNumber;
    agent.dni = updateDto.dni;

    if (updateDto.zoneId) {
      const zone = await this.zoneService.getById(updateDto.zoneId);
      agent.zone = zone;
    }

    const updatedAgent = await this.repo.save(agent);
    await this.appointmentTypeAgentService.updateMany(
      updateDto.appointmentTypeAgents,
      updatedAgent,
    );
    return await this.getById(agentId);
  }

  async deactivateAgents() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set to the start of today

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate() + 1); // Set to the start of tomorrow

    await this.repo.update(
      {
        activationStart: MoreThanOrEqual(todayStart.toISOString()),
        active: true,
      },
      { active: false },
    );
  }

  async reactivateAgents() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set to the start of today

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate() + 1); // Set to the start of tomorrow

    await this.repo.update(
      {
        activationEnd: LessThan(tomorrowStart.toISOString()),
        active: false,
      },
      { active: true },
    );
  }

  async startVacation() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set to the start of today

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate() + 1); // Set to the start of tomorrow

    await this.repo.update(
      {
        vacationStart: MoreThanOrEqual(todayStart.toISOString()),
        vacation: true,
      },
      { vacation: false },
    );
  }

  async endVacation() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set to the start of today

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate() + 1); // Set to the start of tomorrow

    await this.repo.update(
      {
        vacationEnd: LessThan(tomorrowStart.toISOString()),
        vacation: false,
      },
      { vacation: true },
    );
  }

  async delete(agentId: number): Promise<Agent> {
    const agent = await this.getById(agentId);
    await this.repo.remove(agent);
    agent.agentId = agentId;
    return agent;
  }
}
