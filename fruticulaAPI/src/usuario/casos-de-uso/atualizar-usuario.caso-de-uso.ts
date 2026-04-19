import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';
import { AtualizarUsuarioDto } from '../dto/atualizar-usuario.dto';
import { UsuarioConsultaService } from '../usuario-consulta.service';
import { UsuarioSemSenha } from '../usuario.types';

const ROUNDS_BCRYPT = 10;

@Injectable()
export class AtualizarUsuarioUseCase {
  constructor(
    @InjectRepository(Usuario)
    private readonly repositorio: Repository<Usuario>,
    private readonly consultaService: UsuarioConsultaService,
  ) {}

  async executar(id: number, dto: AtualizarUsuarioDto): Promise<UsuarioSemSenha> {
    const usuario = await this.consultaService.buscarEntidadePorId(id);

    if (dto.username && dto.username !== usuario.username) {
      const existe = await this.repositorio.findOne({ where: { username: dto.username } });
      if (existe) {
        throw new ConflictException('Nome de usuário já existe');
      }
    }

    if (dto.senha) {
      dto.senha = await bcrypt.hash(dto.senha, ROUNDS_BCRYPT);
    }

    await this.repositorio.update(id, dto);
    return this.consultaService.buscarPorId(id);
  }
}
