import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutenticacaoModule } from 'src/autenticacao/autenticacao.module';
import { Fruta } from './entities/fruta.entity';
import { PalletFruta } from 'src/pallet-frutas/entities/pallet-fruta.entity';
import { FrutaController } from './fruta.controller';
import { FrutaConsultaService } from './fruta-consulta.service';
import { CriarFrutaUseCase } from './casos-de-uso/criar-fruta.caso-de-uso';
import { AtualizarFrutaUseCase } from './casos-de-uso/atualizar-fruta.caso-de-uso';
import { RemoverFrutaUseCase } from './casos-de-uso/remover-fruta.caso-de-uso';

@Module({
  imports: [TypeOrmModule.forFeature([Fruta, PalletFruta]), AutenticacaoModule],
  controllers: [FrutaController],
  providers: [
    FrutaConsultaService,
    CriarFrutaUseCase,
    AtualizarFrutaUseCase,
    RemoverFrutaUseCase,
  ],
  exports: [FrutaConsultaService, TypeOrmModule],
})
export class FrutaModule {}
