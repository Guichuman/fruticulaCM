import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutenticacaoModule } from 'src/autenticacao/autenticacao.module';
import { TipoFruta } from './entities/tipo-fruta.entity';
import { Fruta } from 'src/fruta/entities/fruta.entity';
import { PalletFruta } from 'src/pallet-frutas/entities/pallet-fruta.entity';
import { TipoFrutaController } from './tipo-fruta.controller';
import { TipoFrutaConsultaService } from './tipo-fruta-consulta.service';
import { CriarTipoFrutaUseCase } from './casos-de-uso/criar-tipo-fruta.caso-de-uso';
import { AtualizarTipoFrutaUseCase } from './casos-de-uso/atualizar-tipo-fruta.caso-de-uso';
import { RemoverTipoFrutaUseCase } from './casos-de-uso/remover-tipo-fruta.caso-de-uso';

@Module({
  imports: [TypeOrmModule.forFeature([TipoFruta, Fruta, PalletFruta]), AutenticacaoModule],
  controllers: [TipoFrutaController],
  providers: [
    TipoFrutaConsultaService,
    CriarTipoFrutaUseCase,
    AtualizarTipoFrutaUseCase,
    RemoverTipoFrutaUseCase,
  ],
  exports: [TipoFrutaConsultaService],
})
export class TipoFrutaModule {}
