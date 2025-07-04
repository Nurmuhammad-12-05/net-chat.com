import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class GroqService {
  constructor(
    private readonly httpService: HttpService,
    private readonly db: DatabaseService,
  ) {}

  async generateText(prompt: string) {
    try {
      const headers = {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      };

      const body = {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      };

      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.groq.com/openai/v1/chat/completions',
          body,
          { headers },
        ),
      );

      const ai = await this.db.prisma.chatAi.create({
        data: {
          question: prompt,
          answer: response.data.choices[0].message.content,
        },
      });

      return ai;
    } catch (error) {
      throw new InternalServerErrorException(
        'For some reason, Ai is not working yet.',
      );
    }
  }

  async getAllAnsquery() {
    const ansquery = await this.db.prisma.chatAi.findMany();

    return ansquery;
  }
}
