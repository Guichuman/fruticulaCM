import { Module } from '@nestjs/common';
import { CargaController } from './carga.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carga } from './entities/carga.entity';
import { Caminhao } from 'src/caminhao/entities/caminhao.entity';
import { CargaService } from './carga.service';
import { Motorista } from 'src/motorista/entities/motorista.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carga, Caminhao, Motorista])],
  controllers: [CargaController],
  providers: [CargaService],
  exports: [TypeOrmModule, CargaService],
})
export class CargaModule {}
