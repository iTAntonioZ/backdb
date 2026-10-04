import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      status: 'online',
      message: 'API NestJS funcionando correctamente',
      timestamp: new Date().toISOString(),
    };
  }
}