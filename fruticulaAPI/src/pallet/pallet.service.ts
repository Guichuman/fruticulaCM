import { Injectable } from '@nestjs/common';
import { CreatePalletDto } from './dto/create-pallet.dto';
import { UpdatePalletDto } from './dto/update-pallet.dto';

@Injectable()
export class PalletService {
  create(createPalletDto: CreatePalletDto) {
    return 'This action adds a new pallet';
  }

  findAll() {
    return `This action returns all pallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pallet`;
  }

  update(id: number, updatePalletDto: UpdatePalletDto) {
    return `This action updates a #${id} pallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} pallet`;
  }
}
