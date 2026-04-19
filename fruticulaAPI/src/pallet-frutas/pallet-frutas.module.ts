import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PalletFrutasConsultaService } from './pallet-frutas-consulta.service';
import { CriarPalletFrutaUseCase } from './casos-de-uso/criar-pallet-fruta.caso-de-uso';
import { AtualizarPalletFrutaUseCase } from './casos-de-uso/atualizar-pallet-fruta.caso-de-uso';
import { RemoverPalletFrutaUseCase } from './casos-de-uso/remover-pallet-fruta.caso-de-uso';
import { PalletFrutasController } from './pallet-frutas.controller';
import { PalletFruta } from './entities/pallet-fruta.entity';
import { Pallet } from 'src/pallet/entities/pallet.entity';
import { TipoFrutaEmbalagem } from 'src/tipo-fruta-embalagem/entities/tipo-fruta-embalagem.entity';
import { AutenticacaoModule } from 'src/autenticacao/autenticacao.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PalletFruta, Pallet, TipoFrutaEmbalagem]),
    AutenticacaoModule,
  ],
  controllers: [PalletFrutasController],
  providers: [PalletFrutasConsultaService, CriarPalletFrutaUseCase, AtualizarPalletFrutaUseCase, RemoverPalletFrutaUseCase],
  exports: [PalletFrutasConsultaService, TypeOrmModule],
})
export class PalletFrutasModule {}
