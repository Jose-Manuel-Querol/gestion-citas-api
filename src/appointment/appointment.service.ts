/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import {
  Between,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { DayService } from '../day/day.service';
import { AppointmentTypeAgentService } from '../appointment-type-agent/appointment-type-agent.service';
import { LocationService } from '../location/location.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { CancelManyAppointments } from './dtos/cancel-many-appointments.dto';
import {
  convertIsoToDate,
  generateFiveDigitNumber,
  getDayAfterTomorrow,
} from '../shared/shared-functions';
import { Day } from '../day/day.entity';
import * as moment from 'moment';
import { AppointmentTypeService } from '../appointment-type/appointment-type.service';
//import * as PDFDocument from 'pdfkit';
import PDFDocument from 'pdfkit-table';
import { WhatsappService } from '../shared/whatsapp.service';
import { VacationDayService } from '../vacation-day/vacation-day.service';
import { HolidayService } from '../holiday/holiday.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment) private repo: Repository<Appointment>,
    private dayService: DayService,
    private appointmentTypeAgentService: AppointmentTypeAgentService,
    private appointmentTypeService: AppointmentTypeService,
    private locationService: LocationService,
    private whatsappService: WhatsappService,
    private vacationDayService: VacationDayService,
    private holidayService: HolidayService,
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

  async getForReport(
    startingDate: string,
    endingDate: string,
    typeName?: string,
    clientName?: string,
    firstName?: string,
    agentId?: string,
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

    if (agentId) {
      queryBuilder.andWhere('agent.agentId =  :agentId', {
        agentId: parseInt(agentId),
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

  async findAvailableAppointments(appointmentTypeId: number) {
    const targetDays = await this.dayService.filterDaysAndAgents(
      appointmentTypeId,
    );

    const todayISO = new Date().toISOString().split('T')[0];
    const holidays = await this.holidayService.getAllHolidayAvailable(todayISO);
    const holidayDates = new Set(
      holidays.map(
        (holiday) =>
          (holiday.holidayDate as unknown as Date).toISOString().split('T')[0],
      ),
    );

    const availabilityResults = [];

    for (const day of targetDays) {
      // Look up to 4 weeks ahead for each day type to find multiple valid occurrences
      for (let week = 0; week < 4; week++) {
        const date = this.getDateForDayName(day.dayName, week * 7);
        const dateString = date.toISOString().split('T')[0];

        if (date < new Date() || holidayDates.has(dateString)) continue; // Skip past days and holidays

        const agentVacationDays =
          await this.vacationDayService.getAllVacationDayByAgentAndAvailable(
            day.appointmentTypeAgent.agent.agentId,
            todayISO,
          );
        const vacationDates = new Set(
          agentVacationDays.map(
            (vacation) =>
              (vacation.vacationDayDate as unknown as Date)
                .toISOString()
                .split('T')[0],
          ),
        );

        if (vacationDates.has(dateString)) continue; // Skip vacation days

        const availableSlotsAndDate = await this.calculateAvailableSlotsForDay(
          day,
          appointmentTypeId,
        );
        if (!availableSlotsAndDate.availableSlots.length) continue; // Skip days with no available slots

        const location = await this.locationService.getByZone(
          day.appointmentTypeAgent.agent.zone.zoneId,
        );
        availabilityResults.push({
          ...availableSlotsAndDate,
          date: dateString,
          location,
        });
      }
    }

    // Deduplicate entries by date, keeping only the first occurrence of each date
    const uniqueResults = availabilityResults.filter(
      (result, index, self) =>
        index === self.findIndex((t) => t.date === result.date),
    );

    // Sort results by date
    uniqueResults.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return uniqueResults.slice(0, 4);
  }

  private getDateForDayName(dayName: string, offset = 0): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time to the start of today

    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + offset); // Start checking from today + offset days

    let found = 0;
    const limit = 365; // Avoid infinite loops, limit to a year

    while (found < limit) {
      const currentDayName = checkDate
        .toLocaleDateString('es-ES', {
          timeZone: 'Europe/Madrid',
          weekday: 'long',
        })
        .toLowerCase();

      if (currentDayName === dayName.toLowerCase()) {
        return new Date(checkDate);
      }

      checkDate.setDate(checkDate.getDate() + 1);
      found++;
    }

    throw new Error(
      'Unable to find the next occurrence of the day, which suggests an error in day name or logic.',
    );
  }

  private async calculateAvailableSlotsForDay(
    day: Day,
    appointmentTypeId: number,
  ): Promise<{ day: Day; availableSlots: string[] }> {
    // Fetch appointment type to get the duration for appointments
    const appointmentType = await this.appointmentTypeService.getById(
      appointmentTypeId,
    );
    if (!appointmentType) throw new Error('El tipo de cita no fue encontrado');

    const duration = parseInt(appointmentType.duration); // Convert duration to an integer, assuming it's stored in minutes
    let allSlots = [];

    // Process each Franja to generate slots
    for (const franja of day.franjas) {
      const slots = [];
      let currentTimeSlotStart = moment(franja.startingHour, 'HH:mm');
      const endTime = moment(franja.endingHour, 'HH:mm');

      while (currentTimeSlotStart.add(duration, 'minutes').isBefore(endTime)) {
        const slotEnd = moment(currentTimeSlotStart).add(duration, 'minutes');
        slots.push(
          `${currentTimeSlotStart.format('HH:mm')} to ${slotEnd.format(
            'HH:mm',
          )}`,
        );
        currentTimeSlotStart = slotEnd;
      }

      // Fetch appointments for the day and this specific franja to check which slots are already booked
      const appointments = await this.repo.find({
        where: {
          day: { dayId: day.dayId },
          startingHour: MoreThanOrEqual(franja.startingHour),
          endingHour: LessThanOrEqual(franja.endingHour),
          appointmentTypeAgent: { appointmentType: { appointmentTypeId } },
          cancelled: false,
        },
      });

      // Map appointments to their starting hours for comparison
      const bookedTimes = appointments.map((a) => a.startingHour);
      // Filter out slots that have been booked
      const availableSlots = slots.filter(
        (slot) => !bookedTimes.includes(slot.split(' to ')[0]),
      );
      allSlots = allSlots.concat(availableSlots);
    }

    return { day, availableSlots: allSlots };
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
      endingHour: createDto.endingHour,
    });

    const createdAppointment = await this.repo.save(appointment);
    /*await this.whatsappService.sendMessage({
      codigoBot: 'd325d6747956f6a6f56587232b81712e',
      codigoPlantilla: 'recordatorio_citas',
      codigoPostalTel: '+34',
      numeroReceptor: `34${createdAppointment.clientPhoneNumber}`,
      nombreReceptor: createdAppointment.clientName,
      fBotEncendido: true,
      fMostrarMensajeEnChat: true,
      parametros: {
        1: `${createdAppointment.day.dayName}`,
        2: createdAppointment.startingHour,
        3: createdAppointment.location.locationName,
        4: createdAppointment.location.fullAddress,
      },
    });*/
    return createdAppointment;
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
    appointment.endingHour = updateDto.endingHour;
    const code = generateFiveDigitNumber().toString();
    appointment.code = code;
    return await this.repo.save(appointment);
  }

  async createPdf(appointments: Appointment[]): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});
    doc.fontSize(16).text('Reporte de Citas', { align: 'center' });
    doc.moveDown(2);

    // Define the table options directly with pdfkit-table enhancement
    const tableArray = {
      headers: [
        { label: 'Fecha', property: 'date', width: 70 },
        { label: 'Hora', property: 'hour', width: 70 },
        { label: 'Agente', property: 'agent', width: 70 },
        { label: 'Tipo de Cita', property: 'appointmentType', width: 70 },
        { label: 'Nombre del Cliente', property: 'client', width: 70 },
        { label: 'Celular', property: 'phone', width: 70 },
        { label: 'Código', property: 'code', width: 70 },
        { label: 'Centro de Atención', property: 'location', width: 70 },
      ],
      datas: appointments.map((appointment) => ({
        date: convertIsoToDate(appointment.dayDate),
        hour: `${appointment.startingHour} - ${appointment.endingHour}`,
        agent: `${appointment.appointmentTypeAgent.agent.firstName} ${appointment.appointmentTypeAgent.agent.lastName}`,
        appointmentType:
          appointment.appointmentTypeAgent.appointmentType.typeName,
        client: appointment.clientName,
        phone: appointment.clientPhoneNumber,
        code: appointment.code,
        location: appointment.location.locationName,
      })),
    };

    await doc.table(tableArray, {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(8),
    });

    doc.end();
    return new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
  }

  async cancel(cancelDto: CancelManyAppointments): Promise<Appointment[]> {
    const appointments: Appointment[] = [];
    for (let i = 0; i < cancelDto.appointmentIds.length; i++) {
      const appointment = await this.getById(cancelDto.appointmentIds[i]);
      appointment.cancelled = true;
      appointments.push(appointment);
    }

    const updatedAppointments = await this.repo.save(appointments);
    for (let i = 0; i < updatedAppointments.length; i++) {
      await this.whatsappService.sendMessage({
        codigoBot: 'd325d6747956f6a6f56587232b81712e',
        codigoPlantilla: 'cancelar_agenda',
        codigoPostalTel: '+34',
        numeroReceptor: `34${updatedAppointments[i].clientPhoneNumber}`,
        nombreReceptor: updatedAppointments[i].clientName,
        fBotEncendido: true,
        fMostrarMensajeEnChat: true,
        parametros: {
          1: `${updatedAppointments[i].day.dayName}`,
          2: updatedAppointments[i].startingHour,
          3: updatedAppointments[i].location.locationName,
        },
      });
    }
    return updatedAppointments;
  }

  async getAppointmentsInTwoDays(): Promise<Appointment[]> {
    // Calculate the date that is two days after the current day
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 2); // Add two days to the current date

    // Format the date to start at the beginning of the day in ISO format
    const targetDate = new Date(currentDate.setHours(0, 0, 0, 0)).toISOString();

    // Find all appointments where dayDate is exactly two days from now
    return this.repo.find({
      where: {
        dayDate: targetDate,
      },
      relations: {
        appointmentTypeAgent: { appointmentType: true, agent: true },
        location: true,
        day: true,
      },
    });
  }

  async sendReminder() {
    const appointments = await this.getAppointmentsInTwoDays();
    for (let i = 0; i < appointments.length; i++) {
      await this.whatsappService.sendMessage({
        codigoBot: 'd325d6747956f6a6f56587232b81712e',
        codigoPlantilla: 'recordatorio_citas',
        codigoPostalTel: '+34',
        numeroReceptor: `34${appointments[i].clientPhoneNumber}`,
        nombreReceptor: appointments[i].clientName,
        fBotEncendido: true,
        fMostrarMensajeEnChat: true,
        parametros: {
          1: `${appointments[i].day.dayName}`,
          2: appointments[i].startingHour,
          3: appointments[i].location.locationName,
          4: appointments[i].location.fullAddress,
        },
      });
    }
  }

  async cancelOne(appointmentId: number): Promise<Appointment> {
    const appointment = await this.getById(appointmentId);
    appointment.cancelled = true;

    const updatedAppointment = await this.repo.save(appointment);
    await this.whatsappService.sendMessage({
      codigoBot: 'd325d6747956f6a6f56587232b81712e',
      codigoPlantilla: 'cancelar_agenda',
      codigoPostalTel: '+34',
      numeroReceptor: `34${updatedAppointment.clientPhoneNumber}`,
      nombreReceptor: updatedAppointment.clientName,
      fBotEncendido: true,
      fMostrarMensajeEnChat: true,
      parametros: {
        1: `${updatedAppointment.day.dayName}`,
        2: updatedAppointment.startingHour,
        3: updatedAppointment.location.locationName,
      },
    });
    return updatedAppointment;
  }
}
