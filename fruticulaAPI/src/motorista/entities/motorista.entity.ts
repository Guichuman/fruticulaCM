import { Caminhao } from 'src/caminhao/entities/caminhao.entity';
import { StatusMotoristaEnum } from 'src/compartilhado/enums/status-motorista.enum';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('motoristas')
@Check('"status" IN (\'A\', \'I\')')
export class Motorista {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 20 })
  telefone: string;

  @Column({ type: 'varchar', length: 14 })
  cpf: string;

  @Column({ type: 'char', length: 1, default: StatusMotoristaEnum.ATIVO })
  status: StatusMotoristaEnum;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm?: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm?: Date;

  @OneToMany(() => Caminhao, (caminhao) => caminhao.motorista)
  caminhoes: Caminhao[];
}
