import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AutenticacaoModule } from 'src/autenticacao/autenticacao.module';
import { FrutaModule } from 'src/fruta/fruta.module';
import { CaminhaoModule } from 'src/caminhao/caminhao.module';
import { MotoristaModule } from 'src/motorista/motorista.module';
import { CargaModule } from 'src/carga/carga.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { PalletModule } from 'src/pallet/pallet.module';
import { PalletFrutasModule } from 'src/pallet-frutas/pallet-frutas.module';
import { TipoFrutaModule } from 'src/tipo-fruta/tipo-fruta.module';
import { TipoFrutaEmbalagemModule } from 'src/tipo-fruta-embalagem/tipo-fruta-embalagem.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
        ssl: process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      }),
      inject: [ConfigService],
    }),
    AutenticacaoModule,
    UsuarioModule,
    FrutaModule,
    CaminhaoModule,
    MotoristaModule,
    CargaModule,
    PalletModule,
    PalletFrutasModule,
    TipoFrutaModule,
    TipoFrutaEmbalagemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
