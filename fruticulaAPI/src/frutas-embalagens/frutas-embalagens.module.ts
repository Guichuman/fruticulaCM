import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrutasEmbalagensService } from './frutas-embalagens.service';
import { FrutasEmbalagensController } from './frutas-embalagens.controller';
import { PalletFruta } from 'src/pallet-frutas/entities/pallet-fruta.entity';
import { FrutaModule } from 'src/fruta/fruta.module';
import { EmbalagemModule } from 'src/embalagem/embalagem.module';
import { FrutasEmbalagem } from './entities/frutas-embalagen.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FrutasEmbalagem, PalletFruta]),
    forwardRef(() => FrutaModule),
    forwardRef(() => EmbalagemModule),
  ],
  controllers: [FrutasEmbalagensController],
  providers: [FrutasEmbalagensService],
  exports: [TypeOrmModule],
})
export class FrutasEmbalagensModule {}
