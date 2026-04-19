import { Fruta } from 'src/fruta/entities/fruta.entity';
import { TipoFrutaEmbalagem } from 'src/tipo-fruta-embalagem/entities/tipo-fruta-embalagem.entity';
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

@Entity('tipos_fruta')
export class TipoFruta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm?: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm?: Date;

  @ManyToOne(() => Fruta, (fruta) => fruta.tiposFruta, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_fruta' })
  fruta: Fruta;

  @Column({ name: 'id_fruta' })
  idFruta: number;

  @OneToMany(() => TipoFrutaEmbalagem, (embalagem) => embalagem.tipoFruta)
  embalagens: TipoFrutaEmbalagem[];
}
