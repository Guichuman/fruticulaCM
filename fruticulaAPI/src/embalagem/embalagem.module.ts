import { forwardRef, Module } from '@nestjs/common';
import { EmbalagemService } from './embalagem.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Embalagem } from './entities/embalagem.entity';
import { EmbalagemController } from './embalagem.controller';
import { FrutaModule } from 'src/fruta/fruta.module';
import { FrutasEmbalagem } from 'src/frutas-embalagens/entities/frutas-embalagen.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Embalagem, FrutasEmbalagem]),
    forwardRef(() => FrutaModule),
  ],
  controllers: [EmbalagemController],
  providers: [EmbalagemService],
  exports: [EmbalagemService],
})
export class EmbalagemModule {}
