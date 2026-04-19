import { Carga } from 'src/carga/entities/carga.entity';
import { PalletFruta } from 'src/pallet-frutas/entities/pallet-fruta.entity';
import { LadoPalletEnum } from 'src/compartilhado/enums/lado-pallet.enum';
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

@Entity('pallets')
@Check("lado IN ('MA', 'MB', 'AA', 'AB')")
export class Pallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 2, nullable: false })
  lado: LadoPalletEnum;

  @Column({ nullable: false })
  bloco: number;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm?: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm?: Date;

  @Column({ name: 'id_carga', nullable: false })
  idCarga: number;

  @ManyToOne(() => Carga, (carga) => carga.pallets, { nullable: false })
  @JoinColumn({ name: 'id_carga' })
  carga: Carga;

  @OneToMany(() => PalletFruta, (palletFruta) => palletFruta.pallet)
  palletFrutas: PalletFruta[];
}
