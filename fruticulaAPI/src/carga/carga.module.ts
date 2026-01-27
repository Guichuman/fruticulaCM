import { Module } from '@nestjs/common';
import { CargaController } from './carga.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carga } from './entities/carga.entity';
import { Caminhao } from 'src/caminhao/entities/caminhao.entity';
import { CargaService } from './carga.service';
import { Motorista } from 'src/motorista/entities/motorista.entity';
import { Pallet } from 'src/pallet/entities/pallet.entity';
import { PalletFruta } from 'src/pallet-frutas/entities/pallet-fruta.entity';
import { FrutasEmbalagem } from 'src/frutas-embalagens/entities/frutas-embalagen.entity';
import { Fruta } from 'src/fruta/entities/fruta.entity';
import { Embalagem } from 'src/embalagem/entities/embalagem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Carga,
      Caminhao,
      Motorista,
      Pallet,
      PalletFruta,
      FrutasEmbalagem,
      Fruta,
      Embalagem,
    ]),
  ],
  controllers: [CargaController],
  providers: [CargaService],
  exports: [TypeOrmModule, CargaService],
})
export class CargaModule {}
