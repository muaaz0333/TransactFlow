import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
    private configService: ConfigService,
  ) {}

  async performTransaction(userId: string, to: string, amountEth: string) {
    const wallet = await this.walletRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!wallet) {
      throw new HttpException('wallet not found', HttpStatus.NOT_FOUND);
    }
    const password = this.configService.get<string>('PRIVATE_KEY_SECRET');
    if (!password) {
      throw new HttpException('private key not found', HttpStatus.NOT_FOUND);
    }
    const decryptedWallet = await ethers.Wallet.fromEncryptedJson(
      wallet.encryptedPrivateKey,
      password,
    );

    const provider = new ethers.JsonRpcProvider(
      this.configService.get('INFURA_URL'),
    );
    const signer = decryptedWallet.connect(provider);

    const balance = await provider.getBalance(wallet.address);
    const balanceInEth = ethers.formatEther(balance);

    if (parseFloat(balanceInEth) < parseFloat(amountEth)) {
      throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
    }

    const tx = await signer.sendTransaction({
      to,
      value: ethers.parseEther(amountEth),
    });

    return {
      message: 'Transaction sent',
      txHash: tx.hash,
    };
  }
}
