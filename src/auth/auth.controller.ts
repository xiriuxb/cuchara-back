import { Controller, Get, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  @Get('test')
  @ApiBearerAuth()
  testAuth(@Request() req) {
    return {
      message: 'Autenticación exitosa',
      userId: req['userId'],
    };
  }
}
