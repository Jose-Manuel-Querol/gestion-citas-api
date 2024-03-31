import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentTypeAgentService } from './appointment-type-agent.service';

describe('AppointmentTypeAgentService', () => {
  let service: AppointmentTypeAgentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentTypeAgentService],
    }).compile();

    service = module.get<AppointmentTypeAgentService>(
      AppointmentTypeAgentService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
