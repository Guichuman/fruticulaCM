import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pallet } from '../entities/pallet.entity';
import { PalletFruta } from 'src/pallet-frutas/entities/pallet-fruta.entity';
import { PalletConsultaService } from '../pallet-consulta.service';

@Injectable()
export class RemoverPalletUseCase {
  constructor(
    @InjectRepository(Pallet)
    private readonly repositorio: Repository<Pallet>,
    @InjectRepository(PalletFruta)
    private readonly palletFrutaRepositorio: Repository<PalletFruta>,
    private readonly consultaService: PalletConsultaService,
  ) {}

  async executar(id: number): Promise<void> {
    const pallet = await this.consultaService.buscarPorId(id);

    // Remove todos os palletFrutas vinculados antes de excluir o pallet
    await this.palletFrutaRepositorio.delete({ idPallet: pallet.id });

    await this.repositorio.remove(pallet);
  }
}
