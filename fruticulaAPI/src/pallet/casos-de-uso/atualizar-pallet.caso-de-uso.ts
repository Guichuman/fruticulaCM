import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pallet } from '../entities/pallet.entity';
import { Carga } from 'src/carga/entities/carga.entity';
import { AtualizarPalletDto } from '../dto/atualizar-pallet.dto';
import { PalletConsultaService } from '../pallet-consulta.service';

@Injectable()
export class AtualizarPalletUseCase {
  constructor(
    @InjectRepository(Pallet)
    private readonly repositorio: Repository<Pallet>,
    @InjectRepository(Carga)
    private readonly cargaRepositorio: Repository<Carga>,
    private readonly consultaService: PalletConsultaService,
  ) {}

  async executar(id: number, dto: AtualizarPalletDto): Promise<Pallet> {
    const pallet = await this.repositorio.findOneBy({ id });

    if (!pallet) {
      throw new NotFoundException(`Pallet com ID ${id} não encontrado`);
    }

    if (dto.idCarga) {
      const carga = await this.cargaRepositorio.findOneBy({ id: dto.idCarga });
      if (!carga) {
        throw new NotFoundException(`Carga com ID ${dto.idCarga} não encontrada`);
      }
    }

    Object.assign(pallet, dto);
    await this.repositorio.save(pallet);
    return this.consultaService.buscarPorId(id);
  }
}
