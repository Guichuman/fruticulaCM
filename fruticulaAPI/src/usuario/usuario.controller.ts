import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAutenticacaoGuard } from 'src/autenticacao/guards/jwt-autenticacao.guard';
import { AdminGuard } from 'src/autenticacao/guards/admin.guard';
import { UsuarioConsultaService } from './usuario-consulta.service';
import { RegistrarUsuarioUseCase } from './casos-de-uso/registrar-usuario.caso-de-uso';
import { LoginUseCase } from './casos-de-uso/login.caso-de-uso';
import { AtualizarUsuarioUseCase } from './casos-de-uso/atualizar-usuario.caso-de-uso';
import { RemoverUsuarioUseCase } from './casos-de-uso/remover-usuario.caso-de-uso';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { NomeVO } from 'src/compartilhado/value-objects/nome.vo';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly consultaService: UsuarioConsultaService,
    private readonly registrarUseCase: RegistrarUsuarioUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly atualizarUseCase: AtualizarUsuarioUseCase,
    private readonly removerUseCase: RemoverUsuarioUseCase,
  ) {}

  @UseGuards(JwtAutenticacaoGuard, AdminGuard)
  @Post('registrar')
  registrar(@Body() dto: CriarUsuarioDto) {
    NomeVO.criar(dto.nome);
    NomeVO.criar(dto.username);
    return this.registrarUseCase.executar(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.executar(dto);
  }

  @UseGuards(JwtAutenticacaoGuard)
  @Get()
  buscarTodos() {
    return this.consultaService.buscarTodos();
  }

  @UseGuards(JwtAutenticacaoGuard)
  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.consultaService.buscarPorId(+id);
  }

  @UseGuards(JwtAutenticacaoGuard, AdminGuard)
  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarUsuarioDto) {
    if (dto.nome) NomeVO.criar(dto.nome);
    if (dto.username) NomeVO.criar(dto.username);
    return this.atualizarUseCase.executar(+id, dto);
  }

  @UseGuards(JwtAutenticacaoGuard, AdminGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remover(@Param('id') id: string) {
    return this.removerUseCase.executar(+id);
  }
}
