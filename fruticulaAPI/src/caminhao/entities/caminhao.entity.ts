import { Motorista } from 'src/motorista/entities/motorista.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Caminhao {
  constructor() {}
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  placa: string;

  @Column()
  qtdBlocos: number;

  @Column({ type: 'varchar', length: 55 })
  status: string;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => Motorista, (motorista) => motorista.caminhoes, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'motoristaId' })
  motorista: Motorista;

  @RelationId((c: Caminhao) => c.motorista)
  motoristaId: number | null;
}
