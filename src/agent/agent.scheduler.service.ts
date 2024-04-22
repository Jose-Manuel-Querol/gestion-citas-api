import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AgentService } from './agent.service';

@Injectable()
export class AgentSchedulerService {
  constructor(
    @Inject(forwardRef(() => AgentService))
    private agentService: AgentService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDeactivation() {
    await this.agentService.deactivateAgents();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleReactivation() {
    await this.agentService.reactivateAgents();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleVacationStart() {
    await this.agentService.startVacation();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleVacationEnd() {
    await this.agentService.endVacation();
  }
}
