import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentTypeAgentController } from './appointment-type-agent.controller';

describe('AppointmentTypeAgentController', () => {
  let controller: AppointmentTypeAgentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentTypeAgentController],
    }).compile();

    controller = module.get<AppointmentTypeAgentController>(
      AppointmentTypeAgentController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
