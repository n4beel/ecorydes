import { Test, TestingModule } from '@nestjs/testing';
import { OpenAIController } from './openai.controller';
import { OpenAIService } from './openai.service';

describe('OpenAIController', () => {
  let controller: OpenAIController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenAIController],
      providers: [OpenAIService],
    }).compile();

    controller = module.get<OpenAIController>(OpenAIController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
