import { TipoFruta } from 'src/tipo-fruta/entities/tipo-fruta.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('frutas')
export class Fruta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  nome: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm?: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm?: Date;

  @OneToMany(() => TipoFruta, (tf) => tf.fruta)
  tiposFruta: TipoFruta[];
}
