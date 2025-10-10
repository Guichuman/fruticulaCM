import { forwardRef, Module } from '@nestjs/common';
import { MotoristaService } from './motorista.service';
import { MotoristaController } from './motorista.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Motorista } from './entities/motorista.entity';
import { Caminhao } from 'src/caminhao/entities/caminhao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Motorista]), forwardRef(() => Caminhao)],
  controllers: [MotoristaController],
  providers: [MotoristaService],
  exports: [MotoristaService],
})
export class MotoristaModule {}
