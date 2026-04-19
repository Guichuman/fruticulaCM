import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PalletConsultaService } from './pallet-consulta.service';
import { CriarPalletUseCase } from './casos-de-uso/criar-pallet.caso-de-uso';
import { AtualizarPalletUseCase } from './casos-de-uso/atualizar-pallet.caso-de-uso';
import { RemoverPalletUseCase } from './casos-de-uso/remover-pallet.caso-de-uso';
import { PalletController } from './pallet.controller';
import { Pallet } from './entities/pallet.entity';
import { Carga } from 'src/carga/entities/carga.entity';
import { PalletFruta } from 'src/pallet-frutas/entities/pallet-fruta.entity';
import { AutenticacaoModule } from 'src/autenticacao/autenticacao.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pallet, Carga, PalletFruta]),
    AutenticacaoModule,
  ],
  controllers: [PalletController],
  providers: [PalletConsultaService, CriarPalletUseCase, AtualizarPalletUseCase, RemoverPalletUseCase],
  exports: [PalletConsultaService, TypeOrmModule],
})
export class PalletModule {}
