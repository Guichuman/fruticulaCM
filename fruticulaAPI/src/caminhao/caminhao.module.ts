import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutenticacaoModule } from 'src/autenticacao/autenticacao.module';
import { Caminhao } from './entities/caminhao.entity';
import { Motorista } from 'src/motorista/entities/motorista.entity';
import { Carga } from 'src/carga/entities/carga.entity';
import { CaminhaoController } from './caminhao.controller';
import { CaminhaoConsultaService } from './caminhao-consulta.service';
import { CriarCaminhaoUseCase } from './casos-de-uso/criar-caminhao.caso-de-uso';
import { AtualizarCaminhaoUseCase } from './casos-de-uso/atualizar-caminhao.caso-de-uso';
import { RemoverCaminhaoUseCase } from './casos-de-uso/remover-caminhao.caso-de-uso';

@Module({
  imports: [TypeOrmModule.forFeature([Caminhao, Motorista, Carga]), AutenticacaoModule],
  controllers: [CaminhaoController],
  providers: [
    CaminhaoConsultaService,
    CriarCaminhaoUseCase,
    AtualizarCaminhaoUseCase,
    RemoverCaminhaoUseCase,
  ],
  exports: [CaminhaoConsultaService, TypeOrmModule],
})
export class CaminhaoModule {}
