import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoFruta } from '../entities/tipo-fruta.entity';
import { TipoFrutaConsultaService } from '../tipo-fruta-consulta.service';
import { PalletFruta } from 'src/pallet-frutas/entities/pallet-fruta.entity';
import { PossuiCargasException } from 'src/compartilhado/exceptions/possui-cargas.exception';

@Injectable()
export class RemoverTipoFrutaUseCase {
  constructor(
    @InjectRepository(TipoFruta)
    private readonly repositorio: Repository<TipoFruta>,
    @InjectRepository(PalletFruta)
    private readonly palletFrutaRepositorio: Repository<PalletFruta>,
    private readonly consultaService: TipoFrutaConsultaService,
  ) {}

  async executar(id: number): Promise<void> {
    const tipoFruta = await this.consultaService.buscarPorId(id);

    const totalPallets = await this.palletFrutaRepositorio
      .createQueryBuilder('pf')
      .innerJoin('pf.tipoFrutaEmbalagem', 'tfe')
      .where('tfe.idTipoFruta = :id', { id })
      .getCount();

    if (totalPallets > 0) {
      throw new PossuiCargasException('Tipo fruta');
    }

    await this.repositorio.remove(tipoFruta);
  }
}
