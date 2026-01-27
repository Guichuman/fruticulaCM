import { Caminhao } from 'src/caminhao/entities/caminhao.entity';
import { Motorista } from 'src/motorista/entities/motorista.entity';
import { Pallet } from 'src/pallet/entities/pallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Carga {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalBlocos: number;

  @Column()
  maxCaixas: number;

  @Column({ type: 'varchar', length: 55 })
  status: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ nullable: false })
  idCaminhao: number;

  @Column({ nullable: false })
  idMotorista: number;

  @ManyToOne(() => Caminhao, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idCaminhao' })
  caminhao: Caminhao;

  @ManyToOne(() => Motorista, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idMotorista' })
  motorista: Motorista;

  @OneToMany(() => Pallet, (pallet) => pallet.carga)
  pallets: Pallet[];
}
