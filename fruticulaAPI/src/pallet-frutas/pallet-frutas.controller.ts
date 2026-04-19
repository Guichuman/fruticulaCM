import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { JwtAutenticacaoGuard } from 'src/autenticacao/guards/jwt-autenticacao.guard';
import { PalletFrutasConsultaService } from './pallet-frutas-consulta.service';
import { CriarPalletFrutaUseCase } from './casos-de-uso/criar-pallet-fruta.caso-de-uso';
import { AtualizarPalletFrutaUseCase } from './casos-de-uso/atualizar-pallet-fruta.caso-de-uso';
import { RemoverPalletFrutaUseCase } from './casos-de-uso/remover-pallet-fruta.caso-de-uso';
import { CriarPalletFrutaDto } from './dto/criar-pallet-fruta.dto';
import { AtualizarPalletFrutaDto } from './dto/atualizar-pallet-fruta.dto';
import { QuantidadeVO } from 'src/compartilhado/value-objects/quantidade.vo';

@UseGuards(JwtAutenticacaoGuard)
@Controller('pallet-fruta')
export class PalletFrutasController {
  constructor(
    private readonly consultaService: PalletFrutasConsultaService,
    private readonly criarUseCase: CriarPalletFrutaUseCase,
    private readonly atualizarUseCase: AtualizarPalletFrutaUseCase,
    private readonly removerUseCase: RemoverPalletFrutaUseCase,
  ) {}

  @Post()
  criar(@Body() dto: CriarPalletFrutaDto) {
    QuantidadeVO.criar(dto.quantidadeCaixa);
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
  atualizar(@Param('id') id: string, @Body() dto: AtualizarPalletFrutaDto) {
    if (dto.quantidadeCaixa !== undefined) QuantidadeVO.criar(dto.quantidadeCaixa);
    return this.atualizarUseCase.executar(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remover(@Param('id') id: string) {
    return this.removerUseCase.executar(+id);
  }
}
