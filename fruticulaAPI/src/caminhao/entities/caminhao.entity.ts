import { Motorista } from 'src/motorista/entities/motorista.entity';
import { StatusCaminhaoEnum } from 'src/compartilhado/enums/status-caminhao.enum';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity('caminhoes')
@Check("status IN ('A', 'I')")
@Check("pallet_baixo IN ('S', 'N')")
export class Caminhao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, unique: true })
  placa: string;

  @Column({ type: 'varchar', length: 32 })
  modelo: string;

  @Column({ name: 'qtd_blocos' })
  qtdBlocos: number;

  @Column({ type: 'char', length: 1, default: StatusCaminhaoEnum.ATIVO })
  status: StatusCaminhaoEnum;

  @Column({ name: 'pallet_baixo', type: 'char', length: 1, default: 'N' })
  palletBaixo: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm?: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm?: Date;

  @ManyToOne(() => Motorista, (motorista) => motorista.caminhoes, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_motorista' })
  motorista: Motorista;

  @RelationId((c: Caminhao) => c.motorista)
  idMotorista: number | null;
}
