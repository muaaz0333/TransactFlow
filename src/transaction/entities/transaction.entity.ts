import { TransactionStatus } from '../../users/enums/transaction';
import {
  Column,
  CreateDateColumn, Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.sentTransactions)
  @JoinColumn({ name: 'sender_id' })
  sender: string;

  @ManyToOne(() => User, (user) => user.receivedTransactions)
  @JoinColumn({ name: 'receiver_id' })
  receiver: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}
