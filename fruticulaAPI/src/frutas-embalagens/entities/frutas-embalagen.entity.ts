import { Embalagem } from 'src/embalagem/entities/embalagem.entity';
import { Fruta } from 'src/fruta/entities/fruta.entity';
import { PalletFruta } from 'src/pallet-frutas/entities/pallet-fruta.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class FrutasEmbalagem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  peso: number;

  @Column()
  sku: number;

  @Column({ type: 'varchar', length: 55 })
  tipo: string;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => Fruta, (fruta) => fruta.frutasEmbalagens, {
    nullable: false,
  })
  @JoinColumn({ name: 'frutaId' })
  fruta: Fruta;

  @ManyToOne(() => Embalagem, (embalagem) => embalagem.frutasEmbalagens, {
    nullable: false,
  })
  @JoinColumn({ name: 'embalagemId' })
  embalagem: Embalagem;

  @OneToMany(() => PalletFruta, (palletFruta) => palletFruta.frutasEmbalagem)
  palletFrutas: PalletFruta[];
}
