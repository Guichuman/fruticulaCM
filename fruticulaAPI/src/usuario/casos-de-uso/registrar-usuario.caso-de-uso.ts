import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';
import { CriarUsuarioDto } from '../dto/criar-usuario.dto';
import { UsuarioSemSenha } from '../usuario.types';
import { StatusUsuarioEnum } from 'src/compartilhado/enums/status-usuario.enum';
import { PerfilUsuarioEnum } from 'src/compartilhado/enums/perfil-usuario.enum';

const ROUNDS_BCRYPT = 10;

@Injectable()
export class RegistrarUsuarioUseCase {
  constructor(
    @InjectRepository(Usuario)
    private readonly repositorio: Repository<Usuario>,
  ) {}

  async executar(dto: CriarUsuarioDto): Promise<UsuarioSemSenha> {
    const existe = await this.repositorio.findOne({ where: { username: dto.username } });
    if (existe) {
      throw new ConflictException('Nome de usuário já existe');
    }

    const senhaHash = await bcrypt.hash(dto.senha, ROUNDS_BCRYPT);
    const usuario = this.repositorio.create({
      ...dto,
      senha: senhaHash,
      status: StatusUsuarioEnum.ATIVO,
      perfil: dto.perfil ?? PerfilUsuarioEnum.FUNCIONARIO,
    });
    const salvo = await this.repositorio.save(usuario);

    const { senha: _, ...dados } = salvo;
    return dados as UsuarioSemSenha;
  }
}
