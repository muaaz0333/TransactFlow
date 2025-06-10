import { Module } from '@nestjs/common';
import { TransactionService } from './transaction services/transaction.service';
import { TransactionController } from './transaction controllers/transaction.controller';
import { WalletsService } from '../wallets/wallet services/wallets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Transaction, Wallet, User])
  ],
  controllers: [TransactionController],
  providers: [TransactionService, WalletsService],
})
export class TransactionModule {}
