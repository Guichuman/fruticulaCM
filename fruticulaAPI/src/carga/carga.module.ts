import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CargaConsultaService } from './carga-consulta.service';
import { CriarCargaUseCase } from './casos-de-uso/criar-carga.caso-de-uso';
import { AtualizarCargaUseCase } from './casos-de-uso/atualizar-carga.caso-de-uso';
import { RemoverCargaUseCase } from './casos-de-uso/remover-carga.caso-de-uso';
import { SalvarPalletCargaUseCase } from './casos-de-uso/salvar-pallet-carga.caso-de-uso';
import { CargaController } from './carga.controller';
import { RomaneioService } from './romaneio.service';
import { Carga } from './entities/carga.entity';
import { Caminhao } from 'src/caminhao/entities/caminhao.entity';
import { Motorista } from 'src/motorista/entities/motorista.entity';
import { AutenticacaoModule } from 'src/autenticacao/autenticacao.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Carga, Caminhao, Motorista]),
    AutenticacaoModule,
  ],
  controllers: [CargaController],
  providers: [CargaConsultaService, CriarCargaUseCase, AtualizarCargaUseCase, RemoverCargaUseCase, SalvarPalletCargaUseCase, RomaneioService],
  exports: [CargaConsultaService, TypeOrmModule],
})
export class CargaModule {}
