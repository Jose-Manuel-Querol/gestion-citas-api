import { Test, TestingModule } from '@nestjs/testing';
import { VacationDayController } from './vacation-day.controller';

describe('VacationDayController', () => {
  let controller: VacationDayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacationDayController],
    }).compile();

    controller = module.get<VacationDayController>(VacationDayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
