import { FrutasEmbalagem } from 'src/frutas-embalagens/entities/frutas-embalagen.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Fruta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => FrutasEmbalagem, (fe) => fe.fruta)
  frutasEmbalagens: FrutasEmbalagem[];
}
