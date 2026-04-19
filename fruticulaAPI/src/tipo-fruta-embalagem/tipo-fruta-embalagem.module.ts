import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutenticacaoModule } from 'src/autenticacao/autenticacao.module';
import { TipoFrutaEmbalagem } from './entities/tipo-fruta-embalagem.entity';
import { TipoFruta } from 'src/tipo-fruta/entities/tipo-fruta.entity';
import { PalletFruta } from 'src/pallet-frutas/entities/pallet-fruta.entity';
import { TipoFrutaEmbalagemController } from './tipo-fruta-embalagem.controller';
import { TipoFrutaEmbalagemConsultaService } from './tipo-fruta-embalagem-consulta.service';
import { CriarTipoFrutaEmbalagemUseCase } from './casos-de-uso/criar-tipo-fruta-embalagem.caso-de-uso';
import { AtualizarTipoFrutaEmbalagemUseCase } from './casos-de-uso/atualizar-tipo-fruta-embalagem.caso-de-uso';
import { RemoverTipoFrutaEmbalagemUseCase } from './casos-de-uso/remover-tipo-fruta-embalagem.caso-de-uso';

@Module({
  imports: [TypeOrmModule.forFeature([TipoFrutaEmbalagem, TipoFruta, PalletFruta]), AutenticacaoModule],
  controllers: [TipoFrutaEmbalagemController],
  providers: [
    TipoFrutaEmbalagemConsultaService,
    CriarTipoFrutaEmbalagemUseCase,
    AtualizarTipoFrutaEmbalagemUseCase,
    RemoverTipoFrutaEmbalagemUseCase,
  ],
  exports: [TipoFrutaEmbalagemConsultaService],
})
export class TipoFrutaEmbalagemModule {}
