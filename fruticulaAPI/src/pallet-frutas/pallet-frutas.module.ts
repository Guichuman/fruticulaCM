import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PalletFrutasService } from './pallet-frutas.service';
import { PalletFrutasController } from './pallet-frutas.controller';
import { PalletFruta } from './entities/pallet-fruta.entity';
import { FrutasEmbalagem } from 'src/frutas-embalagens/entities/frutas-embalagen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PalletFruta, FrutasEmbalagem])],
  controllers: [PalletFrutasController],
  providers: [PalletFrutasService],
  exports: [TypeOrmModule],
})
export class PalletFrutasModule {}
