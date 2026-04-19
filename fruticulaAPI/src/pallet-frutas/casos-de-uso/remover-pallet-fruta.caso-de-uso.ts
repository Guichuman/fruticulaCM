import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PalletFruta } from '../entities/pallet-fruta.entity';
import { PalletFrutasConsultaService } from '../pallet-frutas-consulta.service';

@Injectable()
export class RemoverPalletFrutaUseCase {
  constructor(
    @InjectRepository(PalletFruta)
    private readonly repositorio: Repository<PalletFruta>,
    private readonly consultaService: PalletFrutasConsultaService,
  ) {}

  async executar(id: number): Promise<void> {
    const palletFruta = await this.consultaService.buscarPorId(id);
    await this.repositorio.remove(palletFruta);
  }
}
