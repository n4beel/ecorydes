import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OpenAIService {
    private readonly apiUrl = 'https://api.openai.com/v1/assistants';

    constructor(private readonly configService: ConfigService) { }

    async sendMessage(prompt: string, userId: string): Promise<string> {
        try {
            const response = await axios.post(
                `${this.apiUrl}/${this.configService.get('openai.assistantId')}/messages`,
                {
                    user: userId,
                    input: prompt,
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.configService.get('openai.apiKey')}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            return response.data.output;
        } catch (error) {
            console.error('Error communicating with OpenAI:', error.response?.data || error.message);
            throw new HttpException(
                'Failed to fetch response from OpenAI',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
