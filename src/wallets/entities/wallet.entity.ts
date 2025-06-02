import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn, Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('wallet')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({type:'varchar'})
  address: string;

  @Column({type:'text'})
  encryptedPrivateKey:string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
