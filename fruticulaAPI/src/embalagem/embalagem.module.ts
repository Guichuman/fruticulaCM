import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutenticacaoModule } from 'src/autenticacao/autenticacao.module';
import { Embalagem } from './entities/embalagem.entity';
import { EmbalagemController } from './embalagem.controller';
import { EmbalagemConsultaService } from './embalagem-consulta.service';
import { CriarEmbalagemUseCase } from './casos-de-uso/criar-embalagem.caso-de-uso';
import { AtualizarEmbalagemUseCase } from './casos-de-uso/atualizar-embalagem.caso-de-uso';
import { RemoverEmbalagemUseCase } from './casos-de-uso/excluir-embalagem.caso-de-uso';

@Module({
  imports: [
    TypeOrmModule.forFeature([Embalagem]),
    AutenticacaoModule,
  ],
  controllers: [EmbalagemController],
  providers: [
    EmbalagemConsultaService,
    CriarEmbalagemUseCase,
    AtualizarEmbalagemUseCase,
    RemoverEmbalagemUseCase,
  ],
  exports: [EmbalagemConsultaService, TypeOrmModule],
})
export class EmbalagemModule {}
