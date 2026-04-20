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
import { FrutaConsultaService } from './fruta-consulta.service';
import { CriarFrutaUseCase } from './casos-de-uso/criar-fruta.caso-de-uso';
import { AtualizarFrutaUseCase } from './casos-de-uso/atualizar-fruta.caso-de-uso';
import { RemoverFrutaUseCase } from './casos-de-uso/remover-fruta.caso-de-uso';
import { CriarFrutaDto } from './dto/criar-fruta.dto';
import { AtualizarFrutaDto } from './dto/atualizar-fruta.dto';
import { NomeVO } from 'src/compartilhado/value-objects/nome.vo';

@UseGuards(JwtAutenticacaoGuard)
@Controller('fruta')
export class FrutaController {
  constructor(
    private readonly consultaService: FrutaConsultaService,
    private readonly criarUseCase: CriarFrutaUseCase,
    private readonly atualizarUseCase: AtualizarFrutaUseCase,
    private readonly removerUseCase: RemoverFrutaUseCase,
  ) {}

  @Post()
  criar(@Body() dto: CriarFrutaDto) {
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
  atualizar(@Param('id') id: string, @Body() dto: AtualizarFrutaDto) {
    if (dto.nome) NomeVO.criar(dto.nome);
    return this.atualizarUseCase.executar(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remover(@Param('id') id: string) {
    return this.removerUseCase.executar(+id);
  }
}
