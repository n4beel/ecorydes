import { Body, Controller, Post } from '@nestjs/common';
import { OpenAIService } from './openai.service';

@Controller('openai')
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) { }

  @Post('start')
  async startQuiz(@Body('userId') userId: string): Promise<string> {
    const prompt = 'Start a 10-question trivia quiz.';
    return this.openAIService.sendMessage(prompt, userId);
  }

  @Post('answer')
  async answerQuestion(
    @Body('userId') userId: string,
    @Body('answer') answer: string,
  ): Promise<string> {
    return this.openAIService.sendMessage(answer, userId);
  }
}
