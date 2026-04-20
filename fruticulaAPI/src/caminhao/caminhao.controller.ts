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
import { CaminhaoConsultaService } from './caminhao-consulta.service';
import { CriarCaminhaoUseCase } from './casos-de-uso/criar-caminhao.caso-de-uso';
import { AtualizarCaminhaoUseCase } from './casos-de-uso/atualizar-caminhao.caso-de-uso';
import { RemoverCaminhaoUseCase } from './casos-de-uso/remover-caminhao.caso-de-uso';
import { CriarCaminhaoDto } from './dto/criar-caminhao.dto';
import { AtualizarCaminhaoDto } from './dto/atualizar-caminhao.dto';
import { PlacaVO } from 'src/compartilhado/value-objects/placa.vo';
import { QuantidadeVO } from 'src/compartilhado/value-objects/quantidade.vo';

@UseGuards(JwtAutenticacaoGuard)
@Controller('caminhao')
export class CaminhaoController {
  constructor(
    private readonly consultaService: CaminhaoConsultaService,
    private readonly criarUseCase: CriarCaminhaoUseCase,
    private readonly atualizarUseCase: AtualizarCaminhaoUseCase,
    private readonly removerUseCase: RemoverCaminhaoUseCase,
  ) {}

  @Post()
  criar(@Body() dto: CriarCaminhaoDto) {
    PlacaVO.criar(dto.placa);
    QuantidadeVO.criar(dto.qtdBlocos);
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
  atualizar(@Param('id') id: string, @Body() dto: AtualizarCaminhaoDto) {
    if (dto.placa) PlacaVO.criar(dto.placa);
    if (dto.qtdBlocos !== undefined) QuantidadeVO.criar(dto.qtdBlocos);
    return this.atualizarUseCase.executar(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remover(@Param('id') id: string) {
    return this.removerUseCase.executar(+id);
  }
}
