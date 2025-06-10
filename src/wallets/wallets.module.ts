import { Module } from '@nestjs/common';
import { WalletsService } from './wallet services/wallets.service';
import { WalletsController } from './wallet controllers/wallets.controller';
import { UsersService } from '../users/user services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, User])],
  controllers: [WalletsController],
  providers: [WalletsService, UsersService],
})
export class WalletsModule {}
