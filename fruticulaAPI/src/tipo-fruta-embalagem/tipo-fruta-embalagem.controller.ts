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
import { TipoFrutaEmbalagemConsultaService } from './tipo-fruta-embalagem-consulta.service';
import { CriarTipoFrutaEmbalagemUseCase } from './casos-de-uso/criar-tipo-fruta-embalagem.caso-de-uso';
import { AtualizarTipoFrutaEmbalagemUseCase } from './casos-de-uso/atualizar-tipo-fruta-embalagem.caso-de-uso';
import { RemoverTipoFrutaEmbalagemUseCase } from './casos-de-uso/remover-tipo-fruta-embalagem.caso-de-uso';
import { CriarTipoFrutaEmbalagemDto } from './dto/criar-tipo-fruta-embalagem.dto';
import { AtualizarTipoFrutaEmbalagemDto } from './dto/atualizar-tipo-fruta-embalagem.dto';

@UseGuards(JwtAutenticacaoGuard)
@Controller('tipo-fruta-embalagem')
export class TipoFrutaEmbalagemController {
  constructor(
    private readonly consultaService: TipoFrutaEmbalagemConsultaService,
    private readonly criarUseCase: CriarTipoFrutaEmbalagemUseCase,
    private readonly atualizarUseCase: AtualizarTipoFrutaEmbalagemUseCase,
    private readonly removerUseCase: RemoverTipoFrutaEmbalagemUseCase,
  ) {}

  @Post()
  criar(@Body() dto: CriarTipoFrutaEmbalagemDto) {
    return this.criarUseCase.executar(dto);
  }

  @Get('tipo/:idTipoFruta')
  buscarPorTipo(@Param('idTipoFruta') idTipoFruta: string) {
    return this.consultaService.buscarPorTipo(+idTipoFruta);
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarTipoFrutaEmbalagemDto) {
    return this.atualizarUseCase.executar(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remover(@Param('id') id: string) {
    return this.removerUseCase.executar(+id);
  }
}
