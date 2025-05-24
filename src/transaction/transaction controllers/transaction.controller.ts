import { Controller } from '@nestjs/common';
import { TransactionService } from '../transaction services/transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
}
