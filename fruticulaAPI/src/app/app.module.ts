import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrutaModule } from 'src/fruta/fruta.module';
import { CaminhaoModule } from 'src/caminhao/caminhao.module';
import { MotoristaModule } from 'src/motorista/motorista.module';
import { CargaModule } from 'src/carga/carga.module';
import { EmbalagemModule } from 'src/embalagem/embalagem.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
