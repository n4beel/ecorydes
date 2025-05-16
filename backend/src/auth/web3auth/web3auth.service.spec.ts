import { Test, TestingModule } from '@nestjs/testing';
import { Web3authService } from './web3Auth.service';

describe('Web3authService', () => {
  let service: Web3authService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Web3authService],
    }).compile();

    service = module.get<Web3authService>(Web3authService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
