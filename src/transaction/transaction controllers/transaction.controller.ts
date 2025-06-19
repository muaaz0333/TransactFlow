import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionService } from '../transaction services/transaction.service';
import { AuthGuard } from '../../utils/guards/auth.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(AuthGuard)
  @Post('/send')
  async sendTransaction(@Req() req, @Body() body) {
    const { to, amount } = body;
    return this.transactionService.performTransaction(req.user.id, to, amount);
  }
}
