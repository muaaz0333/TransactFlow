import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';
import { ethers } from 'ethers';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../entities/wallet.entity';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private configService: ConfigService,
  ) {}

  async createWalletForUser(createWalletDto: CreateWalletDto) {
    const { userId, password } = createWalletDto;
    const existingWallet = await this.walletRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user']
    });
    if (existingWallet) {
      throw new HttpException(
        'wallet already exist for this user',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const wallet = ethers.Wallet.createRandom();

    const encryptionPassword =
      this.configService.get<string>('PRIVATE_KEY_SECRET');
    if (!encryptionPassword) {
      throw new Error(
        'PRIVATE_KEY_SECRET is not defined in environment variables',
      );
    }
    const encryptedPrivateKey = await wallet.encrypt(encryptionPassword);

    const newWallet = this.walletRepo.create({
      user,
      address: wallet.address,
      encryptedPrivateKey,
    });
    await this.walletRepo.save(newWallet);
    return {
      message: 'wallet created successfully.',
      address: wallet.address,
    };
  }

  async getWalletPrivateKey(walletId: string): Promise<string> {
    const wallet = await this.walletRepo.findOne({ where: { id: walletId } });

    if (!wallet) {
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
    }

    const password = this.configService.get<string>('PRIVATE_KEY_SECRET');
    if (!password) {
      throw new Error(
        'PRIVATE_KEY_SECRET is not defined in environment variables',
      );
    }
    const decryptedWallet = await ethers.Wallet.fromEncryptedJson(
      wallet.encryptedPrivateKey,
      password,
    );

    return decryptedWallet.privateKey;
  }

  getWalletDetails(privateKey: string) {
    const wallet = new ethers.Wallet(privateKey);
    return {
      address: wallet.address,
    };
  }

  findAll() {
    return `This action returns all wallets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
