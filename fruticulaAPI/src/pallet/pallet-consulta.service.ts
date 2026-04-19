import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pallet } from './entities/pallet.entity';

@Injectable()
export class PalletConsultaService {
  constructor(
    @InjectRepository(Pallet)
    private readonly repositorio: Repository<Pallet>,
  ) {}

  async buscarTodos(): Promise<Pallet[]> {
    return this.repositorio.find({
      relations: { carga: true, palletFrutas: true },
    });
  }

  async buscarPorId(id: number): Promise<Pallet> {
    const pallet = await this.repositorio.findOne({
      where: { id },
      relations: {
        carga: true,
        palletFrutas: { tipoFrutaEmbalagem: true },
      },
    });

    if (!pallet) {
      throw new NotFoundException(`Pallet com ID ${id} não encontrado`);
    }

    return pallet;
  }
}
