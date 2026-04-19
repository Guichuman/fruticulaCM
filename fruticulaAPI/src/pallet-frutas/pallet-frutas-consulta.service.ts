import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PalletFruta } from './entities/pallet-fruta.entity';

@Injectable()
export class PalletFrutasConsultaService {
  constructor(
    @InjectRepository(PalletFruta)
    private readonly repositorio: Repository<PalletFruta>,
  ) {}

  async buscarTodos(): Promise<PalletFruta[]> {
    return this.repositorio.find({
      relations: {
        pallet: true,
        tipoFrutaEmbalagem: true,
      },
    });
  }

  async buscarPorId(id: number): Promise<PalletFruta> {
    const palletFruta = await this.repositorio.findOne({
      where: { id },
      relations: {
        pallet: true,
        tipoFrutaEmbalagem: true,
      },
    });

    if (!palletFruta) {
      throw new NotFoundException(`PalletFruta com ID ${id} não encontrado`);
    }

    return palletFruta;
  }
}
