import { Caminhao } from 'src/caminhao/entities/caminhao.entity';
import { Motorista } from 'src/motorista/entities/motorista.entity';
import { Pallet } from 'src/pallet/entities/pallet.entity';
import { StatusCargaEnum } from 'src/compartilhado/enums/status-carga.enum';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cargas')
@Check("status IN ('F', 'C', 'V')")
export class Carga {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'total_blocos' })
  totalBlocos: number;

  @Column({ name: 'max_caixas' })
  maxCaixas: number;

  @Column({ type: 'char', length: 1, default: StatusCargaEnum.CARREGANDO })
  status: StatusCargaEnum;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm?: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm?: Date;

  @Column({ name: 'id_caminhao', nullable: false })
  idCaminhao: number;

  @Column({ name: 'id_motorista', nullable: false })
  idMotorista: number;

  @ManyToOne(() => Caminhao, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_caminhao' })
  caminhao: Caminhao;

  @ManyToOne(() => Motorista, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_motorista' })
  motorista: Motorista;

  @OneToMany(() => Pallet, (pallet) => pallet.carga)
  pallets: Pallet[];
}
