import { Pallet } from 'src/pallet/entities/pallet.entity';
import { FrutasEmbalagem } from 'src/frutas-embalagens/entities/frutas-embalagen.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PalletFruta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  quantidadeCaixa: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ nullable: false })
  idPallet: number;

  @Column({ nullable: false })
  idFrutasEmbalagem: number;

  @ManyToOne(
    () => FrutasEmbalagem,
    (frutasEmbalagem) => frutasEmbalagem.palletFrutas,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'idFrutasEmbalagem' })
  frutasEmbalagem: FrutasEmbalagem;

  @ManyToOne(() => Pallet, (pallet) => pallet.palletFrutas, { nullable: false })
  @JoinColumn({ name: 'idPallet' })
  pallet: Pallet;
}
