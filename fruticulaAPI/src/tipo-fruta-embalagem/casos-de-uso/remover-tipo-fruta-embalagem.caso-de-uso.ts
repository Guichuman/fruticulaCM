import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoFrutaEmbalagem } from '../entities/tipo-fruta-embalagem.entity';
import { TipoFrutaEmbalagemConsultaService } from '../tipo-fruta-embalagem-consulta.service';
import { PalletFruta } from 'src/pallet-frutas/entities/pallet-fruta.entity';
import { PossuiCargasException } from 'src/compartilhado/exceptions/possui-cargas.exception';

@Injectable()
export class RemoverTipoFrutaEmbalagemUseCase {
  constructor(
    @InjectRepository(TipoFrutaEmbalagem)
    private readonly repositorio: Repository<TipoFrutaEmbalagem>,
    @InjectRepository(PalletFruta)
    private readonly palletFrutaRepositorio: Repository<PalletFruta>,
    private readonly consultaService: TipoFrutaEmbalagemConsultaService,
  ) {}

  async executar(id: number): Promise<void> {
    await this.consultaService.buscarPorId(id);

    const totalPallets = await this.palletFrutaRepositorio.count({
      where: { idTipoFrutaEmbalagem: id },
    });
    if (totalPallets > 0) {
      throw new PossuiCargasException('Embalagem');
    }

    await this.repositorio.delete(id);
  }
}
