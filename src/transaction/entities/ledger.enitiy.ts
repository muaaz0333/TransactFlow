import { User } from '../../users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Transaction } from 'typeorm';
import { TransactionStatus } from '../../users/enums/transaction';

@Entity('ledgers')
export class Ledger{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(()=>User)
  @JoinColumn({name:'user_id'})
  user: User;

  @ManyToOne(()=> Transaction)
  @JoinColumn({name:'transaction_id'})
  transaction: Transaction;

  @Column({type:'enum', enum: ['debit', 'credit']})
  type: 'debit' | 'credit';

  @Column('decimal', {precision: 12, scale: 2})
  amount: number;

  @Column('decimal', {precision: 12, scale: 2})
  balanceAfter:number;

  @CreateDateColumn()
  createdAt: Date;
}
