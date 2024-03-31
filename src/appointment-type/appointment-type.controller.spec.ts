import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentTypeController } from './appointment-type.controller';

describe('AppointmentTypeController', () => {
  let controller: AppointmentTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentTypeController],
    }).compile();

    controller = module.get<AppointmentTypeController>(
      AppointmentTypeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
