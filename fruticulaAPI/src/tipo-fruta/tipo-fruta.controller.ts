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
import { TipoFrutaConsultaService } from './tipo-fruta-consulta.service';
import { CriarTipoFrutaUseCase } from './casos-de-uso/criar-tipo-fruta.caso-de-uso';
import { AtualizarTipoFrutaUseCase } from './casos-de-uso/atualizar-tipo-fruta.caso-de-uso';
import { RemoverTipoFrutaUseCase } from './casos-de-uso/remover-tipo-fruta.caso-de-uso';
import { CriarTipoFrutaDto } from './dto/criar-tipo-fruta.dto';
import { AtualizarTipoFrutaDto } from './dto/atualizar-tipo-fruta.dto';
import { NomeVO } from 'src/compartilhado/value-objects/nome.vo';

@UseGuards(JwtAutenticacaoGuard)
@Controller('tipo-fruta')
export class TipoFrutaController {
  constructor(
    private readonly consultaService: TipoFrutaConsultaService,
    private readonly criarUseCase: CriarTipoFrutaUseCase,
    private readonly atualizarUseCase: AtualizarTipoFrutaUseCase,
    private readonly removerUseCase: RemoverTipoFrutaUseCase,
  ) {}

  @Post()
  criar(@Body() dto: CriarTipoFrutaDto) {
    NomeVO.criar(dto.nome);
    return this.criarUseCase.executar(dto);
  }

  @Get('fruta/:idFruta')
  buscarPorFruta(@Param('idFruta') idFruta: string) {
    return this.consultaService.buscarPorFruta(+idFruta);
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarTipoFrutaDto) {
    if (dto.nome) NomeVO.criar(dto.nome);
    return this.atualizarUseCase.executar(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remover(@Param('id') id: string) {
    return this.removerUseCase.executar(+id);
  }
}
