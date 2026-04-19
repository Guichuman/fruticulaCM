import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAutenticacaoGuard } from 'src/autenticacao/guards/jwt-autenticacao.guard';
import { MotoristaConsultaService } from './motorista-consulta.service';
import { CriarMotoristaUseCase } from './casos-de-uso/criar-motorista.caso-de-uso';
import { AtualizarMotoristaUseCase } from './casos-de-uso/atualizar-motorista.caso-de-uso';
import { RemoverMotoristaUseCase } from './casos-de-uso/remover-motorista.caso-de-uso';
import { CriarMotoristaDto } from './dto/criar-motorista.dto';
import { AtualizarMotoristaDto } from './dto/atualizar-motorista.dto';
import { NomeVO } from 'src/compartilhado/value-objects/nome.vo';
import { TelefoneVO } from 'src/compartilhado/value-objects/telefone.vo';
import { CpfVO } from 'src/compartilhado/value-objects/cpf.vo';

@UseGuards(JwtAutenticacaoGuard)
@Controller('motorista')
export class MotoristaController {
  constructor(
    private readonly consultaService: MotoristaConsultaService,
    private readonly criarUseCase: CriarMotoristaUseCase,
    private readonly atualizarUseCase: AtualizarMotoristaUseCase,
    private readonly removerUseCase: RemoverMotoristaUseCase,
  ) {}

  @Post()
  criar(@Body() dto: CriarMotoristaDto) {
    NomeVO.criar(dto.nome);
    TelefoneVO.criar(dto.telefone);
    CpfVO.criar(dto.cpf);
    return this.criarUseCase.executar(dto);
  }

  @Get()
  buscarTodos() {
    return this.consultaService.buscarTodos();
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.consultaService.buscarPorId(+id);
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarMotoristaDto) {
    if (dto.nome) NomeVO.criar(dto.nome);
    if (dto.telefone) TelefoneVO.criar(dto.telefone);
    if (dto.cpf) CpfVO.criar(dto.cpf);
    return this.atualizarUseCase.executar(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remover(@Param('id') id: string) {
    return this.removerUseCase.executar(+id);
  }
}
