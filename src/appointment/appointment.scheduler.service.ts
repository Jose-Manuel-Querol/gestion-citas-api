import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppointmentService } from './appointment.service';

@Injectable()
export class AppointmentSchedulerService {
  constructor(
    @Inject(forwardRef(() => AppointmentService))
    private appointmentService: AppointmentService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDeactivation() {
    await this.appointmentService.sendReminder();
  }
}
