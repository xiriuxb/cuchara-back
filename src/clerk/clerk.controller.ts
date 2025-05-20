import {
  Controller,
  Post,
  Headers,
  Body,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { Webhook } from 'svix';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/users/user.service';

@Controller('clerk/webhook')
export class ClerkWebhookController {
  private readonly webhookSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.webhookSecret = this.configService.get<string>('CLERK_WEBHOOK_SECRET');

    if (!this.webhookSecret) {
      throw new Error('CLERK_WEBHOOK_SECRET no está definido');
    }
  }

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Body() body: any,
  ) {
    const payload = JSON.stringify(body);
    const headers = {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    };

    const wh = new Webhook(this.webhookSecret);
    let evt;

    try {
      evt = wh.verify(payload, headers);
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Invalid webhook signature');
    }

    const { type, data } = evt;

    const handlers = {
      'user.created': this.userService.handleUserCreated.bind(this.userService),
      'user.updated': this.userService.handleUserUpdated.bind(this.userService),
      'user.deleted': this.userService.handleUserDeleted.bind(this.userService),
    };

    const handler = handlers[type];
    if (handler) {
      await handler(data);
    } else {
      console.warn(`Unhandled webhook type: ${type}`);
    }

    return { received: true };
  }
}
