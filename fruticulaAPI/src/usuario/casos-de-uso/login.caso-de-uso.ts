import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';
import { LoginDto } from '../dto/login.dto';
import { RespostaLogin, UsuarioSemSenha } from '../usuario.types';
import { StatusUsuarioEnum } from 'src/compartilhado/enums/status-usuario.enum';

@Injectable()
export class LoginUseCase {
  constructor(
    @InjectRepository(Usuario)
    private readonly repositorio: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async executar(dto: LoginDto): Promise<RespostaLogin> {
    const usuario = await this.repositorio.findOne({ where: { username: dto.username } });
    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(dto.senha, usuario.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (usuario.status !== StatusUsuarioEnum.ATIVO) {
      throw new UnauthorizedException('Usuário inativo');
    }

    const token = this.jwtService.sign({
      sub: usuario.id,
      username: usuario.username,
      nome: usuario.nome,
      perfil: usuario.perfil,
    });

    const { senha: _, ...dados } = usuario;
    return { token, usuario: dados as UsuarioSemSenha };
  }
}
