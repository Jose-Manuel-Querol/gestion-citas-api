import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { Between, In, Repository } from 'typeorm';
import { DayService } from '../day/day.service';
import { AppointmentTypeAgentService } from '../appointment-type-agent/appointment-type-agent.service';
import { LocationService } from '../location/location.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { CancelManyAppointments } from './dtos/cancel-many-appointments.dto';
import {
  generateFiveDigitNumber,
  getDayAfterTomorrow,
} from '../shared/shared-functions';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment) private repo: Repository<Appointment>,
    private dayService: DayService,
    private appointmentTypeAgentService: AppointmentTypeAgentService,
    private locationService: LocationService,
  ) {}

  async getAll(): Promise<Appointment[]> {
    return await this.repo.find({
      relations: {
        appointmentTypeAgent: { appointmentType: true, agent: true },
        location: true,
        day: true,
      },
    });
  }

  async getAllWithinDayAfterTomorrow(): Promise<Appointment[]> {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString();
    const afterTomorrowStart = getDayAfterTomorrow(currentDate);
    const afterTomorrowEnd = new Date(afterTomorrowStart);
    afterTomorrowEnd.setUTCHours(23, 59, 59, 999);
    const afterTomorrowEndString = afterTomorrowEnd.toISOString();
    return await this.repo.find({
      where: {
        cancelled: false,
        day: { dayDate: Between(currentDateString, afterTomorrowEndString) },
      },
      relations: {
        appointmentTypeAgent: { appointmentType: true, agent: true },
        location: true,
        day: true,
      },
    });
  }

  async getAllWithinDatesByAgents(
    startingDate: string,
    endingDate: string,
    agentsId: number[],
  ): Promise<Appointment[]> {
    if (agentsId.length > 0) {
      return await this.repo.find({
        where: {
          cancelled: false,
          day: { dayDate: Between(startingDate, endingDate) },
          appointmentTypeAgent: { agent: { agentId: In(agentsId) } },
        },
        relations: {
          appointmentTypeAgent: { appointmentType: true, agent: true },
          location: true,
          day: true,
        },
      });
    } else {
      return await this.repo.find({
        where: {
          cancelled: false,
          day: { dayDate: Between(startingDate, endingDate) },
        },
        relations: {
          appointmentTypeAgent: { appointmentType: true, agent: true },
          location: true,
          day: true,
        },
      });
    }
  }

  async getAllWithinDatesByAppointmentTypes(
    startingDate: string,
    endingDate: string,
    appointmentTypeIds: number[],
  ): Promise<Appointment[]> {
    if (appointmentTypeIds.length > 0) {
      return await this.repo.find({
        where: {
          cancelled: false,
          day: { dayDate: Between(startingDate, endingDate) },
          appointmentTypeAgent: {
            appointmentType: { appointmentTypeId: In(appointmentTypeIds) },
          },
        },
        relations: {
          appointmentTypeAgent: { appointmentType: true, agent: true },
          location: true,
          day: true,
        },
      });
    } else {
      return await this.repo.find({
        where: {
          cancelled: false,
          day: { dayDate: Between(startingDate, endingDate) },
        },
        relations: {
          appointmentTypeAgent: { appointmentType: true, agent: true },
          location: true,
          day: true,
        },
      });
    }
  }

  async getAllCancelledWithinDatesByAgents(
    startingDate: string,
    endingDate: string,
    agentsId: number[],
  ): Promise<Appointment[]> {
    if (agentsId.length > 0) {
      return await this.repo.find({
        where: {
          cancelled: true,
          day: { dayDate: Between(startingDate, endingDate) },
          appointmentTypeAgent: { agent: { agentId: In(agentsId) } },
        },
        relations: {
          appointmentTypeAgent: { appointmentType: true, agent: true },
          location: true,
          day: true,
        },
      });
    } else {
      return await this.repo.find({
        where: {
          cancelled: true,
          day: { dayDate: Between(startingDate, endingDate) },
        },
        relations: {
          appointmentTypeAgent: { appointmentType: true, agent: true },
          location: true,
          day: true,
        },
      });
    }
  }

  async getAllWithinDates(
    startingDate: string,
    endingDate: string,
    typeName?: string,
    clientName?: string,
    firstName?: string,
    code?: string,
  ): Promise<Appointment[]> {
    const queryBuilder = this.repo.createQueryBuilder('appointment');
    queryBuilder
      .leftJoinAndSelect(
        'appointment.appointmentTypeAgent',
        'appointmentTypeAgent',
      )
      .leftJoinAndSelect(
        'appointmentTypeAgent.appointmentType',
        'appointmentType',
      )
      .leftJoinAndSelect('appointment.day', 'day')
      .leftJoinAndSelect('appointmentTypeAgent.agent', 'agent')
      .leftJoinAndSelect('appointment.location', 'location');

    // Mandatory conditions
    queryBuilder
      .where('appointment.cancelled = :cancelled', { cancelled: false })
      .andWhere('day.dayDate BETWEEN :startingDate AND :endingDate', {
        startingDate,
        endingDate,
      });

    // Optional conditions
    if (clientName) {
      queryBuilder.andWhere('appointment.clientName = :clientName', {
        clientName,
      });
    }
    if (code) {
      queryBuilder.andWhere('appointment.code = :code', { code });
    }
    if (typeName) {
      queryBuilder.andWhere('appointmentType.typeName = :typeName', {
        typeName,
      });
    }
    if (firstName) {
      queryBuilder.andWhere('agent.firstName = :firstName', { firstName });
    }

    return await queryBuilder.getMany();
  }

  async getAllActive(): Promise<Appointment[]> {
    return await this.repo.find({
      where: { cancelled: false },
      relations: {
        appointmentTypeAgent: { appointmentType: true, agent: true },
        location: true,
        day: true,
      },
    });
  }

  async getById(appointmentId: number): Promise<Appointment> {
    const appointment = await this.repo.findOne({
      where: { appointmentId },
      relations: {
        appointmentTypeAgent: { appointmentType: true, agent: true },
        location: true,
        day: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('La cita no existe');
    }

    return appointment;
  }

  async create(createDto: CreateAppointmentDto): Promise<Appointment> {
    const day = await this.dayService.getById(createDto.dayId);
    const appointmentTypeAgent = await this.appointmentTypeAgentService.getById(
      createDto.appointmentTypeAgentId,
    );
    const location = await this.locationService.getById(createDto.locationId);
    const code = generateFiveDigitNumber().toString();
    const appointment = this.repo.create({
      appointmentTypeAgent,
      clientAddress: createDto.clientAddress,
      clientPhoneNumber: createDto.clientPhoneNumber,
      clientName: createDto.clientName,
      day,
      dayNumber: createDto.dayNumber,
      location,
      startingHour: createDto.startingHour,
      code,
    });

    return await this.repo.save(appointment);
  }

  async update(
    appointmentId: number,
    updateDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.getById(appointmentId);
    const day = await this.dayService.getById(updateDto.dayId);
    if (appointment.day.dayId !== day.dayId) {
      appointment.day = day;
    }
    const appointmentTypeAgent = await this.appointmentTypeAgentService.getById(
      updateDto.appointmentTypeAgentId,
    );

    if (
      appointment.appointmentTypeAgent.appointmentTypeAgentId !==
      appointmentTypeAgent.appointmentTypeAgentId
    ) {
      appointment.appointmentTypeAgent = appointmentTypeAgent;
    }
    const location = await this.locationService.getById(updateDto.locationId);

    if (appointment.location.locationId !== location.locationId) {
      appointment.location = location;
    }
    appointment.clientAddress = updateDto.clientAddress;
    appointment.clientName = updateDto.clientName;
    appointment.clientPhoneNumber = updateDto.clientPhoneNumber;
    appointment.dayNumber = updateDto.dayNumber;
    appointment.startingHour = updateDto.startingHour;
    const code = generateFiveDigitNumber().toString();
    appointment.code = code;
    return await this.repo.save(appointment);
  }

  async cancel(cancelDto: CancelManyAppointments): Promise<Appointment[]> {
    const appointments: Appointment[] = [];
    for (let i = 0; i < cancelDto.appointmentIds.length; i++) {
      const appointment = await this.getById(cancelDto.appointmentIds[i]);
      appointment.cancelled = true;
      appointments.push(appointment);
    }

    return await this.repo.save(appointments);
  }
}
