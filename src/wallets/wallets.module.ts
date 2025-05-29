import { Module } from '@nestjs/common';
import { WalletsService } from './wallet services/wallets.service';
import { WalletsController } from './wallet controllers/wallets.controller';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService],
})
export class WalletsModule {}
