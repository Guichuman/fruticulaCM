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
import { EmbalagemConsultaService } from './embalagem-consulta.service';
import { CriarEmbalagemUseCase } from './casos-de-uso/criar-embalagem.caso-de-uso';
import { AtualizarEmbalagemUseCase } from './casos-de-uso/atualizar-embalagem.caso-de-uso';
import { RemoverEmbalagemUseCase } from './casos-de-uso/excluir-embalagem.caso-de-uso';
import { CriarEmbalagemDto } from './dto/criar-embalagem.dto';
import { AtualizarEmbalagemDto } from './dto/atualizar-embalagem.dto';
import { NomeVO } from 'src/compartilhado/value-objects/nome.vo';

@UseGuards(JwtAutenticacaoGuard)
@Controller('embalagem')
export class EmbalagemController {
  constructor(
    private readonly consultaService: EmbalagemConsultaService,
    private readonly criarUseCase: CriarEmbalagemUseCase,
    private readonly atualizarUseCase: AtualizarEmbalagemUseCase,
    private readonly removerUseCase: RemoverEmbalagemUseCase,
  ) {}

  @Post()
  criar(@Body() dto: CriarEmbalagemDto) {
    NomeVO.criar(dto.nome);
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
  atualizar(@Param('id') id: string, @Body() dto: AtualizarEmbalagemDto) {
    if (dto.nome) NomeVO.criar(dto.nome);
    return this.atualizarUseCase.executar(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remover(@Param('id') id: string) {
    return this.removerUseCase.executar(+id);
  }
}
