import { FrutasEmbalagem } from 'src/frutas-embalagens/entities/frutas-embalagen.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PalletFruta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  quantidadeCaixa: number;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;

  @ManyToOne(
    () => FrutasEmbalagem,
    (frutasEmbalagem) => frutasEmbalagem.palletFrutas,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'idFrutasEmbalagem' })
  frutasEmbalagem: FrutasEmbalagem;
}
