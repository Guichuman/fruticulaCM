import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { UsuarioSemSenha } from './usuario.types';

@Injectable()
export class UsuarioConsultaService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repositorio: Repository<Usuario>,
  ) {}

  async buscarTodos(): Promise<UsuarioSemSenha[]> {
    const usuarios = await this.repositorio.find();
    return usuarios.map(({ senha: _, ...dados }) => dados as UsuarioSemSenha);
  }

  async buscarPorId(id: number): Promise<UsuarioSemSenha> {
    const usuario = await this.repositorio.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    const { senha: _, ...dados } = usuario;
    return dados as UsuarioSemSenha;
  }

  async buscarEntidadePorId(id: number): Promise<Usuario> {
    const usuario = await this.repositorio.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return usuario;
  }
}
