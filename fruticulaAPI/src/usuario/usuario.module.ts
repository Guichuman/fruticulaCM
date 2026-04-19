import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioController } from './usuario.controller';
import { UsuarioConsultaService } from './usuario-consulta.service';
import { RegistrarUsuarioUseCase } from './casos-de-uso/registrar-usuario.caso-de-uso';
import { LoginUseCase } from './casos-de-uso/login.caso-de-uso';
import { AtualizarUsuarioUseCase } from './casos-de-uso/atualizar-usuario.caso-de-uso';
import { RemoverUsuarioUseCase } from './casos-de-uso/remover-usuario.caso-de-uso';
import { Usuario } from './entities/usuario.entity';
import { AutenticacaoModule } from 'src/autenticacao/autenticacao.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), AutenticacaoModule],
  controllers: [UsuarioController],
  providers: [
    UsuarioConsultaService,
    RegistrarUsuarioUseCase,
    LoginUseCase,
    AtualizarUsuarioUseCase,
    RemoverUsuarioUseCase,
  ],
  exports: [UsuarioConsultaService, TypeOrmModule],
})
export class UsuarioModule {}
