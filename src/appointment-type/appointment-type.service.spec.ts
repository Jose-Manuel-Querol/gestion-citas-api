import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentTypeService } from './appointment-type.service';

describe('AppointmentTypeService', () => {
  let service: AppointmentTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentTypeService],
    }).compile();

    service = module.get<AppointmentTypeService>(AppointmentTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
