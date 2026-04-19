import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Check } from 'typeorm';
import { StatusUsuarioEnum } from 'src/compartilhado/enums/status-usuario.enum';
import { PerfilUsuarioEnum } from 'src/compartilhado/enums/perfil-usuario.enum';

@Entity('usuarios')
@Check('"status" IN (\'A\', \'I\')')
@Check('"perfil" IN (\'A\', \'F\')')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  username: string;

  @Column({ length: 255 })
  senha: string;

  @Column({ length: 150 })
  nome: string;

  @Column({ type: 'char', length: 1, default: StatusUsuarioEnum.ATIVO })
  status: StatusUsuarioEnum;

  @Column({ type: 'char', length: 1, default: PerfilUsuarioEnum.FUNCIONARIO })
  perfil: PerfilUsuarioEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
