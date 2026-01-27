import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Omit<Usuario, 'senha'>> {
    // Verificar se username já existe
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { username: createUsuarioDto.username },
    });

    if (usuarioExistente) {
      throw new ConflictException('Nome de usuário já existe');
    }

    // Hash da senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(createUsuarioDto.senha, saltRounds);

    // Criar usuário
    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      senha: senhaHash,
    });

    const usuarioSalvo = await this.usuarioRepository.save(usuario);

    // Remover senha do retorno
    const { senha, ...usuarioSemSenha } = usuarioSalvo;
    return usuarioSemSenha;
  }

  async login(loginDto: LoginDto): Promise<Omit<Usuario, 'senha'>> {
    const usuario = await this.usuarioRepository.findOne({
      where: { username: loginDto.username },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(loginDto.senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar status
    if (usuario.status !== 'ativo') {
      throw new UnauthorizedException('Usuário inativo');
    }

    // Remover senha do retorno
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }

  async findAll(): Promise<Omit<Usuario, 'senha'>[]> {
    const usuarios = await this.usuarioRepository.find();
    return usuarios.map(({ senha, ...usuarioSemSenha }) => usuarioSemSenha);
  }

  async findOne(id: number): Promise<Omit<Usuario, 'senha'>> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Omit<Usuario, 'senha'>> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    // Se estiver atualizando senha, fazer hash
    if (updateUsuarioDto.senha) {
      const saltRounds = 10;
      updateUsuarioDto.senha = await bcrypt.hash(updateUsuarioDto.senha, saltRounds);
    }

    // Se estiver atualizando username, verificar se já existe
    if (updateUsuarioDto.username && updateUsuarioDto.username !== usuario.username) {
      const usuarioExistente = await this.usuarioRepository.findOne({
        where: { username: updateUsuarioDto.username },
      });

      if (usuarioExistente) {
        throw new ConflictException('Nome de usuário já existe');
      }
    }

    await this.usuarioRepository.update(id, updateUsuarioDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    await this.usuarioRepository.remove(usuario);
  }
}
