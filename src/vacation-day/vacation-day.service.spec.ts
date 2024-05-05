import { Test, TestingModule } from '@nestjs/testing';
import { VacationDayService } from './vacation-day.service';

describe('VacationDayService', () => {
  let service: VacationDayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VacationDayService],
    }).compile();

    service = module.get<VacationDayService>(VacationDayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
