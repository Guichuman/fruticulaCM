import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAutenticacaoGuard } from 'src/autenticacao/guards/jwt-autenticacao.guard';
import { CargaConsultaService } from './carga-consulta.service';
import { CriarCargaUseCase } from './casos-de-uso/criar-carga.caso-de-uso';
import { AtualizarCargaUseCase } from './casos-de-uso/atualizar-carga.caso-de-uso';
import { RemoverCargaUseCase } from './casos-de-uso/remover-carga.caso-de-uso';
import { SalvarPalletCargaUseCase } from './casos-de-uso/salvar-pallet-carga.caso-de-uso';
import { RomaneioService } from './romaneio.service';
import { CriarCargaDto } from './dto/criar-carga.dto';
import { AtualizarCargaDto } from './dto/atualizar-carga.dto';
import { SalvarPalletCargaDto } from './dto/salvar-pallet-carga.dto';
import { QuantidadeVO } from 'src/compartilhado/value-objects/quantidade.vo';
import { StatusCargaEnum } from 'src/compartilhado/enums/status-carga.enum';

@UseGuards(JwtAutenticacaoGuard)
@Controller('carga')
export class CargaController {
  constructor(
    private readonly consultaService: CargaConsultaService,
    private readonly criarUseCase: CriarCargaUseCase,
    private readonly atualizarUseCase: AtualizarCargaUseCase,
    private readonly removerUseCase: RemoverCargaUseCase,
    private readonly salvarPalletUseCase: SalvarPalletCargaUseCase,
    private readonly romaneioService: RomaneioService,
  ) {}

  @Post()
  criar(@Body() dto: CriarCargaDto) {
    QuantidadeVO.criar(dto.totalBlocos);
    QuantidadeVO.criar(dto.maxCaixas);
    return this.criarUseCase.executar(dto);
  }

  @Get()
  buscarTodos(
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
    @Query('status') status?: StatusCargaEnum,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.consultaService.buscarTodos(
      pagina ? Number(pagina) : 1,
      limite ? Number(limite) : 20,
      status,
      dataInicio,
      dataFim,
    );
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.consultaService.buscarPorId(+id);
  }

  @Post(':id/pallet')
  salvarPallet(@Param('id') id: string, @Body() dto: SalvarPalletCargaDto) {
    return this.salvarPalletUseCase.executar(+id, dto);
  }

  @Get(':id/romaneio')
  async romaneio(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.romaneioService.gerarPdf(+id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="romaneio-${id}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarCargaDto) {
    if (dto.totalBlocos !== undefined) QuantidadeVO.criar(dto.totalBlocos);
    if (dto.maxCaixas !== undefined) QuantidadeVO.criar(dto.maxCaixas);
    return this.atualizarUseCase.executar(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remover(@Param('id') id: string) {
    return this.removerUseCase.executar(+id);
  }
}
