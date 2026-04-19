import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { JwtAutenticacaoGuard } from 'src/autenticacao/guards/jwt-autenticacao.guard';
import { PalletConsultaService } from './pallet-consulta.service';
import { CriarPalletUseCase } from './casos-de-uso/criar-pallet.caso-de-uso';
import { AtualizarPalletUseCase } from './casos-de-uso/atualizar-pallet.caso-de-uso';
import { RemoverPalletUseCase } from './casos-de-uso/remover-pallet.caso-de-uso';
import { CriarPalletDto } from './dto/criar-pallet.dto';
import { AtualizarPalletDto } from './dto/atualizar-pallet.dto';

@UseGuards(JwtAutenticacaoGuard)
@Controller('pallet')
export class PalletController {
  constructor(
    private readonly consultaService: PalletConsultaService,
    private readonly criarUseCase: CriarPalletUseCase,
    private readonly atualizarUseCase: AtualizarPalletUseCase,
    private readonly removerUseCase: RemoverPalletUseCase,
  ) {}

  @Post()
  criar(@Body() dto: CriarPalletDto) {
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
  atualizar(@Param('id') id: string, @Body() dto: AtualizarPalletDto) {
    return this.atualizarUseCase.executar(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remover(@Param('id') id: string) {
    return this.removerUseCase.executar(+id);
  }
}
