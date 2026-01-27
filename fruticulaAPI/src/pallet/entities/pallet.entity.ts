import { Carga } from 'src/carga/entities/carga.entity';
import { PalletFruta } from 'src/pallet-frutas/entities/pallet-fruta.entity';
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
export class Pallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  lado: string;

  @Column({ nullable: false })
  bloco: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ nullable: false })
  idCarga: number;

  @ManyToOne(() => Carga, (carga) => carga.pallets, { nullable: false })
  @JoinColumn({ name: 'idCarga' })
  carga: Carga;

  @OneToMany(() => PalletFruta, (palletFruta) => palletFruta.pallet)
  palletFrutas: PalletFruta[];
}
