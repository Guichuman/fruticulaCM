import { Pallet } from 'src/pallet/entities/pallet.entity';
import { TipoFrutaEmbalagem } from 'src/tipo-fruta-embalagem/entities/tipo-fruta-embalagem.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pallet_frutas')
export class PalletFruta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'quantidade_caixa', nullable: false })
  quantidadeCaixa: number;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm?: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm?: Date;

  @Column({ name: 'id_pallet', nullable: false })
  idPallet: number;

  @Column({ name: 'id_tipo_fruta_embalagem', nullable: false })
  idTipoFrutaEmbalagem: number;

  @ManyToOne(() => TipoFrutaEmbalagem, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_tipo_fruta_embalagem' })
  tipoFrutaEmbalagem: TipoFrutaEmbalagem;

  @ManyToOne(() => Pallet, (pallet) => pallet.palletFrutas, { nullable: false })
  @JoinColumn({ name: 'id_pallet' })
  pallet: Pallet;
}
