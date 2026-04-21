import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Carga } from '../entities/carga.entity';
import { Pallet } from 'src/pallet/entities/pallet.entity';
import { PalletFruta } from 'src/pallet-frutas/entities/pallet-fruta.entity';
import { SalvarPalletCargaDto } from '../dto/salvar-pallet-carga.dto';

@Injectable()
export class SalvarPalletCargaUseCase {
  constructor(
    @InjectRepository(Carga)
    private readonly cargaRepositorio: Repository<Carga>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async executar(idCarga: number, dto: SalvarPalletCargaDto): Promise<{ id: number }> {
    const carga = await this.cargaRepositorio.findOneBy({ id: idCarga });
    if (!carga) {
      throw new NotFoundException(`Carga com ID ${idCarga} não encontrada`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Remove pallet existente no mesmo bloco+lado desta carga
      const existente = await queryRunner.manager.findOne(Pallet, {
        where: { idCarga, bloco: dto.bloco, lado: dto.lado },
      });

      if (existente) {
        await queryRunner.manager.delete(PalletFruta, { idPallet: existente.id });
        await queryRunner.manager.delete(Pallet, { id: existente.id });
      }

      // Cria novo pallet
      const novoPallet = queryRunner.manager.create(Pallet, {
        idCarga,
        bloco: dto.bloco,
        lado: dto.lado,
      });
      const palletSalvo = await queryRunner.manager.save(Pallet, novoPallet);

      // Cria os itens do pallet
      for (const item of dto.itens) {
        const palletFruta = queryRunner.manager.create(PalletFruta, {
          idPallet: palletSalvo.id,
          idTipoFrutaEmbalagem: item.idTipoFrutaEmbalagem,
          quantidadeCaixa: item.quantidadeCaixa,
        });
        await queryRunner.manager.save(PalletFruta, palletFruta);
      }

      await queryRunner.commitTransaction();
      return { id: palletSalvo.id };
    } catch {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Erro ao cadastrar pallet.');
    } finally {
      await queryRunner.release();
    }
  }
}
