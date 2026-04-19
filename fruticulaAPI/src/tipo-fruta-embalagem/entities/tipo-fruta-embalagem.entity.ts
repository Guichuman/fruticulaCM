import { TipoFruta } from 'src/tipo-fruta/entities/tipo-fruta.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tipo_fruta_embalagens')
export class TipoFrutaEmbalagem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  nome: string;

  @Column({ type: 'int' })
  sku: number;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm?: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm?: Date;

  @ManyToOne(() => TipoFruta, (tipo) => tipo.embalagens, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_tipo_fruta' })
  tipoFruta: TipoFruta;

  @Column({ name: 'id_tipo_fruta' })
  idTipoFruta: number;
}
