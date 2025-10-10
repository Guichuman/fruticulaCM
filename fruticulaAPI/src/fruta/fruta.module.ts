import { Module, forwardRef } from '@nestjs/common';
import { FrutaService } from './fruta.service';
import { FrutaController } from './fruta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fruta } from './entities/fruta.entity';
import { Embalagem } from 'src/embalagem/entities/embalagem.entity';
import { FrutasEmbalagem } from 'src/frutas-embalagens/entities/frutas-embalagen.entity';
import { FrutasEmbalagensModule } from 'src/frutas-embalagens/frutas-embalagens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fruta, Embalagem, FrutasEmbalagem]),
    forwardRef(() => FrutasEmbalagensModule),
  ],
  controllers: [FrutaController],
  providers: [FrutaService],
  exports: [TypeOrmModule],
})
export class FrutaModule {}
