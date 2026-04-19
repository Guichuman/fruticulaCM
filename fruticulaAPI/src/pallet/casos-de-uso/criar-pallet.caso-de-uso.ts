import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pallet } from '../entities/pallet.entity';
import { Carga } from 'src/carga/entities/carga.entity';
import { CriarPalletDto } from '../dto/criar-pallet.dto';

@Injectable()
export class CriarPalletUseCase {
  constructor(
    @InjectRepository(Pallet)
    private readonly repositorio: Repository<Pallet>,
    @InjectRepository(Carga)
    private readonly cargaRepositorio: Repository<Carga>,
  ) {}

  async executar(dto: CriarPalletDto): Promise<Pallet> {
    const carga = await this.cargaRepositorio.findOneBy({ id: dto.idCarga });
    if (!carga) {
      throw new NotFoundException(`Carga com ID ${dto.idCarga} não encontrada`);
    }

    const pallet = this.repositorio.create({
      lado: dto.lado,
      bloco: dto.bloco,
      idCarga: dto.idCarga,
    });

    return this.repositorio.save(pallet);
  }
}
