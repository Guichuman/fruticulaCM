import { Module } from '@nestjs/common';
import { PalletService } from './pallet.service';
import { PalletController } from './pallet.controller';

@Module({
  controllers: [PalletController],
  providers: [PalletService],
})
export class PalletModule {}
