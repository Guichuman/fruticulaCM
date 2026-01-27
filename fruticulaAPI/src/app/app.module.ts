import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrutaModule } from 'src/fruta/fruta.module';
import { CaminhaoModule } from 'src/caminhao/caminhao.module';
import { MotoristaModule } from 'src/motorista/motorista.module';
import { CargaModule } from 'src/carga/carga.module';
import { EmbalagemModule } from 'src/embalagem/embalagem.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { PalletModule } from 'src/pallet/pallet.module';
import { PalletFrutasModule } from 'src/pallet-frutas/pallet-frutas.module';
import { FrutasEmbalagensModule } from 'src/frutas-embalagens/frutas-embalagens.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      database: 'fruticulaCM',
      password: '56989771gui',
      autoLoadEntities: true,
      synchronize: true,
    }),
    FrutaModule,
    CaminhaoModule,
    MotoristaModule,
    CargaModule,
    EmbalagemModule,
    UsuarioModule,
    PalletModule,
    PalletFrutasModule,
    FrutasEmbalagensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
