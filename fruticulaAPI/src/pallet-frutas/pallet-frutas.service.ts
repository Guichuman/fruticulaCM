import { Injectable } from '@nestjs/common';
import { CreatePalletFrutaDto } from './dto/create-pallet-fruta.dto';
import { UpdatePalletFrutaDto } from './dto/update-pallet-fruta.dto';

@Injectable()
export class PalletFrutasService {
  create(createPalletFrutaDto: CreatePalletFrutaDto) {
    return 'This action adds a new palletFruta';
  }

  findAll() {
    return `This action returns all palletFrutas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} palletFruta`;
  }

  update(id: number, updatePalletFrutaDto: UpdatePalletFrutaDto) {
    return `This action updates a #${id} palletFruta`;
  }

  remove(id: number) {
    return `This action removes a #${id} palletFruta`;
  }
}
