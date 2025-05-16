import { Test, TestingModule } from '@nestjs/testing';
import { MoonpayController } from './moonpay.controller';

describe('MoonpayController', () => {
  let controller: MoonpayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoonpayController],
    }).compile();

    controller = module.get<MoonpayController>(MoonpayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
