import { Module } from '@nestjs/common';
import { TransactionService } from './transaction services/transaction.service';
import { TransactionController } from './transaction controllers/transaction.controller';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
