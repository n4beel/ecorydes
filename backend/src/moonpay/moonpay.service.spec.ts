import { Test, TestingModule } from '@nestjs/testing';
import { MoonpayService } from './moonpay.service';

describe('MoonpayService', () => {
  let service: MoonpayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoonpayService],
    }).compile();

    service = module.get<MoonpayService>(MoonpayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
