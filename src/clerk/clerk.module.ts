import { Module } from '@nestjs/common';
import { ClerkWebhookController } from './clerk.controller';
import { UserModule } from 'src/users/user.module';

@Module({
  controllers: [ClerkWebhookController],
  imports: [UserModule],
})
export class ClerkModule {}
