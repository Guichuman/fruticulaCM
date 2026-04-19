import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fruta } from '../entities/fruta.entity';
import { FrutaConsultaService } from '../fruta-consulta.service';
import { PalletFruta } from 'src/pallet-frutas/entities/pallet-fruta.entity';
import { PossuiCargasException } from 'src/compartilhado/exceptions/possui-cargas.exception';

@Injectable()
export class RemoverFrutaUseCase {
  constructor(
    @InjectRepository(Fruta)
    private readonly repositorio: Repository<Fruta>,
    @InjectRepository(PalletFruta)
    private readonly palletFrutaRepositorio: Repository<PalletFruta>,
    private readonly consultaService: FrutaConsultaService,
  ) {}

  async executar(id: number): Promise<void> {
    const fruta = await this.consultaService.buscarPorId(id);

    const totalPallets = await this.palletFrutaRepositorio
      .createQueryBuilder('pf')
      .innerJoin('pf.tipoFrutaEmbalagem', 'tfe')
      .innerJoin('tfe.tipoFruta', 'tf')
      .where('tf.idFruta = :id', { id })
      .getCount();

    if (totalPallets > 0) {
      throw new PossuiCargasException('Fruta');
    }

    await this.repositorio.remove(fruta);
  }
}
