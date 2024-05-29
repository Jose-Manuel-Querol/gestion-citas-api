/* eslint-disable @typescript-eslint/no-empty-function */
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
    clientLastName?: string,
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
    if (clientName || clientLastName) {
      queryBuilder.andWhere(
        '(appointment.clientName LIKE :clientName OR appointment.clientLastName LIKE :clientLastName)',
        {
          clientName: clientName ? `%${clientName}%` : '%%',
          clientLastName: clientLastName ? `%${clientLastName}%` : '%%',
        },
      );
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
    clientLastName?: string,
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
    if (clientName || clientLastName) {
      queryBuilder.andWhere(
        '(appointment.clientName LIKE :clientName OR appointment.clientLastName LIKE :clientLastName)',
        {
          clientName: clientName ? `%${clientName}%` : '%%',
          clientLastName: clientLastName ? `%${clientLastName}%` : '%%',
        },
      );
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

    // Objeto para almacenar las ranuras disponibles por día
    const appointmentsByDate = {};

    for (const day of targetDays) {
      for (let week = 0; week < 53; week++) {
        const date = this.getDateForDayName(day.dayName, week * 7);
        let dateString;
        if (date) {
          dateString = date.toISOString().split('T')[0];
        }
        if (date < new Date() || holidayDates.has(dateString)) continue;
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
          date,
        );
        if (!availableSlotsAndDate.availableSlots.length) continue; // Skip days with no available slots

        const agentId = day.appointmentTypeAgent.agent.agentId;
        // Agregar las ranuras disponibles al objeto appointmentsByDate
        if (!appointmentsByDate[dateString]) {
          appointmentsByDate[dateString] = {
            date: dateString,
            agentId: agentId,
            availableSlots: availableSlotsAndDate.availableSlots.map(
              (row) => row.time,
            ),
            location: await this.locationService.getByZone(
              day.appointmentTypeAgent.agent.zone.zoneId,
            ),
            day: day,
          };
        } else {
          // Si ya existe un registro para este día, comparar las ranuras disponibles y actualizar si es necesario
          const existingAppointment = appointmentsByDate[dateString];
          if (
            availableSlotsAndDate.availableSlots.length >
            existingAppointment.availableSlots.length
          ) {
            appointmentsByDate[dateString] = {
              date: dateString,
              agentId: agentId,
              availableSlots: availableSlotsAndDate.availableSlots.map(
                (row) => row.time,
              ),
              location: await this.locationService.getByZone(
                day.appointmentTypeAgent.agent.zone.zoneId,
              ),
              day: day,
            };
          }
        }
      }
    }

    // Convertir el objeto appointmentsByDate en un array

    const appointmentsArray = Object.values(appointmentsByDate);
    // Ordenar los resultados por fecha y tomar los primeros cuatro
    const sortedAppointments = appointmentsArray
      .sort((a, b) => {
        return (
          new Date((a as any).date).getTime() -
          new Date((b as any).date).getTime()
        );
      })
      .slice(0, 4);
    return sortedAppointments;
  }

  private getDateForDayName(dayName: string, offset = 0): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + offset);

    let found = 0;
    const limit = 365;

    while (found < limit) {
      const currentDayName = checkDate
        .toLocaleDateString('es-ES', {
          timeZone: 'Europe/Madrid',
          weekday: 'long',
        })
        .toLowerCase();

      if (currentDayName === dayName.toLowerCase()) {
        return new Date(checkDate);
      } else {
        checkDate.setDate(checkDate.getDate() + 1);
        found++;
      }
    }
  }

  private async calculateAvailableSlotsForDay(
    day: Day,
    appointmentTypeId: number,
    date: Date,
  ): Promise<{
    day: Day;
    availableSlots: { time: string; agentId: number }[];
  }> {
    date.setHours(0, 0, 0);
    const appointmentType = await this.appointmentTypeService.getById(
      appointmentTypeId,
    );
    if (!appointmentType) throw new Error('El tipo de cita no fue encontrado');

    const duration = parseInt(appointmentType.duration);
    let allSlots = [];

    for (const franja of day.franjas) {
      const slots = [];
      const currentTimeSlotStart = moment(franja.startingHour, 'HH:mm');
      const endTime = moment(franja.endingHour, 'HH:mm');

      while (currentTimeSlotStart.isSameOrBefore(endTime)) {
        const slotEnd = moment(currentTimeSlotStart).add(duration, 'minutes');
        if (slotEnd.isSameOrBefore(endTime)) {
          slots.push({
            time: `${currentTimeSlotStart.format('HH:mm')} to ${slotEnd.format(
              'HH:mm',
            )}`,
            agentId: day.appointmentTypeAgent.agent.agentId,
          });
        }
        currentTimeSlotStart.add(duration, 'minutes');
      }
      let appointments = await this.repo.find({
        where: {
          day: { dayId: day.dayId },
          appointmentTypeAgent: {
            appointmentType: { appointmentTypeId },
          },
          cancelled: false,
        },
      });
      appointments = appointments.filter(
        (row) =>
          new Date(row.dayDate).toISOString().split('T')[0] ===
          date.toISOString().split('T')[0],
      );
      const bookedTimes = new Set(
        appointments.map((appointment) => appointment.startingHour),
      );

      const availableSlots = slots.filter(
        (slot) => !bookedTimes.has(slot.time.split(' to ')[0]),
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
      clientLastName: createDto.clientLastName,
      day,
      dayDate: createDto.dayDate,
      location,
      startingHour: createDto.startingHour,
      code,
      endingHour: createDto.endingHour,
    });

    const createdAppointment = await this.repo.save(appointment);
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
    appointment.clientLastName = updateDto.clientLastName;
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
        client: `${appointment.clientName} ${appointment.clientLastName || ''}`,
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
        nombreReceptor: `${updatedAppointments[i].clientName} ${updatedAppointments[i].clientLastName}`,
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
    currentDate.setDate(currentDate.getDate() + 1); // Add two days to the current date

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
        nombreReceptor: `${appointments[i].clientName} ${appointments[i].clientLastName}`,
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
      nombreReceptor: `${updatedAppointment.clientName} ${updatedAppointment.clientLastName}`,
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
