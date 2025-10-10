import { Caminhao } from 'src/caminhao/entities/caminhao.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Motorista {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column()
  telefone: string;

  @Column({ type: 'varchar', length: 50 })
  cpf: string;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => Caminhao, (caminhao) => caminhao.motorista)
  caminhoes: Caminhao[];
}
