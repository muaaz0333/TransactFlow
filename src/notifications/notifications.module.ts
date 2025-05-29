import { Module } from '@nestjs/common';
import { NotificationsService } from './notification services/notifications.service';
import { NotificationsController } from './notification controllers/notifications.controller';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
