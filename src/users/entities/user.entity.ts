import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isKycVerified: boolean;

  @Column()
  phoneNumber: string;

  @Column({ default: 'inactive' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Transaction, (t) => t.sender)
  sentTransactions: Transaction[];

  @OneToMany(() => Transaction, (t) => t.receiver)
  receivedTransactions: Transaction[];

  @OneToOne(() => Wallet, (w) => w.user, {cascade: true})
  wallet: Wallet;
}
