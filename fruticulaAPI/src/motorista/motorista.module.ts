import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutenticacaoModule } from 'src/autenticacao/autenticacao.module';
import { Motorista } from './entities/motorista.entity';
import { Carga } from 'src/carga/entities/carga.entity';
import { MotoristaController } from './motorista.controller';
import { MotoristaConsultaService } from './motorista-consulta.service';
import { CriarMotoristaUseCase } from './casos-de-uso/criar-motorista.caso-de-uso';
import { AtualizarMotoristaUseCase } from './casos-de-uso/atualizar-motorista.caso-de-uso';
import { RemoverMotoristaUseCase } from './casos-de-uso/remover-motorista.caso-de-uso';

@Module({
  imports: [TypeOrmModule.forFeature([Motorista, Carga]), AutenticacaoModule],
  controllers: [MotoristaController],
  providers: [
    MotoristaConsultaService,
    CriarMotoristaUseCase,
    AtualizarMotoristaUseCase,
    RemoverMotoristaUseCase,
  ],
  exports: [MotoristaConsultaService, TypeOrmModule],
})
export class MotoristaModule {}
