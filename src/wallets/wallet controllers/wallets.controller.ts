import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, Req, UseGuards,
} from '@nestjs/common';
import { WalletsService } from '../wallet services/wallets.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';
import { AuthGuard } from '../../utils/guards/auth.guard';

@Controller('wallet')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post('/create')
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletsService.createWalletForUser(createWalletDto);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  getWalletDetails(@Req() req) {
    const userId= req.user.id;
    return this.walletsService.getMyWallet(userId);
  }

  @Get()
  findAll() {
    return this.walletsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletsService.update(+id, updateWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletsService.remove(+id);
  }
}
