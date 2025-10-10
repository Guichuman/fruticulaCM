import { forwardRef, Module } from '@nestjs/common';
import { CaminhaoService } from './caminhao.service';
import { CaminhaoController } from './caminhao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caminhao } from './entities/caminhao.entity';
import { Motorista } from 'src/motorista/entities/motorista.entity';
import { MotoristaModule } from 'src/motorista/motorista.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Caminhao, Motorista]),
    forwardRef(() => MotoristaModule),
  ],
  controllers: [CaminhaoController],
  providers: [CaminhaoService],
  exports: [CaminhaoService],
})
export class CaminhaoModule {}
