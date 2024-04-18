import { Test, TestingModule } from '@nestjs/testing';
import { FranjaService } from './franja.service';

describe('FranjaService', () => {
  let service: FranjaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FranjaService],
    }).compile();

    service = module.get<FranjaService>(FranjaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
