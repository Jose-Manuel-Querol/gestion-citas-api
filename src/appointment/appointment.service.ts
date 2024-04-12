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
import { Day } from '../day/day.entity';
import * as moment from 'moment';
import { AppointmentTypeService } from '../appointment-type/appointment-type.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment) private repo: Repository<Appointment>,
    private dayService: DayService,
    private appointmentTypeAgentService: AppointmentTypeAgentService,
    private appointmentTypeService: AppointmentTypeService,
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
        dayDate: Between(currentDateString, afterTomorrowEndString),
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
          dayDate: Between(startingDate, endingDate),
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
          dayDate: Between(startingDate, endingDate),
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
          dayDate: Between(startingDate, endingDate),
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
          dayDate: Between(startingDate, endingDate),
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
          dayDate: Between(startingDate, endingDate),
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
          dayDate: Between(startingDate, endingDate),
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
      .andWhere('appointment.dayDate BETWEEN :startingDate AND :endingDate', {
        startingDate,
        endingDate,
      });

    // Optional conditions
    if (clientName) {
      queryBuilder.andWhere('appointment.clientName LIKE  :clientName', {
        clientName: `%${clientName}%`,
      });
    }
    if (code) {
      queryBuilder.andWhere('appointment.code LIKE  :code', {
        code: `%${code}%`,
      });
    }
    if (typeName) {
      queryBuilder.andWhere('appointmentType.typeName LIKE :typeName', {
        typeName: `%${typeName}%`,
      });
    }

    if (firstName) {
      queryBuilder.andWhere('agent.firstName LIKE  :firstName', {
        firstName: `%${firstName}%`,
      });
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

  async findAvailableAppointments(appointmentTypeId: number, zoneId: number) {
    // Step 1: Filter days and agents
    const targetDays = await this.dayService.filterDaysAndAgents(
      appointmentTypeId,
    );

    // Temporary dictionary to track unique dates
    const uniqueDates = new Map();

    // Step 2: Calculate available time slots for each day
    const rawAvailability = await Promise.all(
      targetDays.map(async (day) => {
        const availableSlotsAndDate = await this.calculateAvailableSlotsForDay(
          day,
          appointmentTypeId,
        );
        // Append the actual date to each day result
        const date = this.getDateForDayName(day.dayName);
        const location = await this.locationService.getByZone(zoneId);
        return { ...availableSlotsAndDate, date: date.toISOString(), location };
      }),
    );

    // Step 3: Filter out duplicates by date and ensure only days with available slots are included
    const availability = rawAvailability.filter((entry) => {
      const dateKey = entry.date.split('T')[0]; // Extract only the date part
      if (uniqueDates.has(dateKey)) {
        return false;
      }
      uniqueDates.set(dateKey, true);
      return entry.availableSlots.length > 0;
    });

    return availability;
  }

  private getDateForDayName(dayName: string, additionalWeeks = 0): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time part
    const date = new Date(today);
    let count = 0;

    // Iterate more than 7 days to find multiple occurrences
    while (count < 7 + 7 * additionalWeeks) {
      if (
        this.dayService.mapDayEnglishToSpanish(
          date.toLocaleDateString('en-US', { weekday: 'long' }),
        ) === dayName
      ) {
        if (additionalWeeks === 0) {
          return date;
        }
        additionalWeeks--;
      }
      date.setDate(date.getDate() + 1);
      count++;
    }
    return date; // fallback, shouldn't happen
  }

  private async calculateAvailableSlotsForDay(
    day: Day,
    appointmentTypeId: number,
  ): Promise<{ day: Day; availableSlots: string[] }> {
    // Fetch appointment type to get the duration for appointments
    const appointmentType = await this.appointmentTypeService.getById(
      appointmentTypeId,
    );

    if (!appointmentType) throw new Error('Appointment type not found.');

    const duration = parseInt(appointmentType.duration); // Convert duration to an integer, assuming it's stored in minutes

    // Generate slots for the day based on startingHour and endingHour from the Day entity
    const slots = [];
    let currentTimeSlotStart = moment(day.startingHour, 'HH:mm');
    const endTime = moment(day.endingHour, 'HH:mm');

    while (currentTimeSlotStart.add(duration, 'minutes').isBefore(endTime)) {
      const slotEnd = moment(currentTimeSlotStart).add(duration, 'minutes');
      slots.push(
        `${currentTimeSlotStart.format('HH:mm')} to ${slotEnd.format('HH:mm')}`,
      );
      currentTimeSlotStart = slotEnd;
    }

    // Fetch appointments for the day to check which slots are already booked
    const appointments = await this.repo.find({
      where: {
        day: { dayId: day.dayId },
        appointmentTypeAgent: {
          appointmentType: { appointmentTypeId },
        },
        cancelled: false,
      },
    });

    // Map appointments to their starting hours for comparison
    const bookedTimes = appointments.map((a) => a.startingHour);
    // Filter out slots that have been booked
    const availableSlots = slots.filter(
      (slot) => !bookedTimes.includes(slot.split(' to ')[0]),
    );

    return { day, availableSlots };
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
      dayDate: createDto.dayDate,
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
    appointment.dayDate = updateDto.dayDate;
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
