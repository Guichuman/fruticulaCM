import { Caminhao } from 'src/caminhao/entities/caminhao.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LadoPalletEnum } from '../enum/LadoPalletEnum';

@Entity()
export class Pallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  lado: LadoPalletEnum;

  @Column({ nullable: false })
  bloco: number;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;

  @Column({ nullable: false })
  idCaminhao: number;

  @OneToOne(() => Caminhao)
  @JoinColumn({ name: 'idCaminhao' })
  caminhao: Caminhao;
}
