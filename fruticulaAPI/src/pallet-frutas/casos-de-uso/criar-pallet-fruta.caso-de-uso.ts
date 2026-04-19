import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PalletFruta } from '../entities/pallet-fruta.entity';
import { Pallet } from 'src/pallet/entities/pallet.entity';
import { TipoFrutaEmbalagem } from 'src/tipo-fruta-embalagem/entities/tipo-fruta-embalagem.entity';
import { CriarPalletFrutaDto } from '../dto/criar-pallet-fruta.dto';
import { QuantidadeVO } from 'src/compartilhado/value-objects/quantidade.vo';

@Injectable()
export class CriarPalletFrutaUseCase {
  constructor(
    @InjectRepository(PalletFruta)
    private readonly repositorio: Repository<PalletFruta>,
    @InjectRepository(Pallet)
    private readonly palletRepositorio: Repository<Pallet>,
    @InjectRepository(TipoFrutaEmbalagem)
    private readonly tipoFrutaEmbalagemRepositorio: Repository<TipoFrutaEmbalagem>,
  ) {}

  async executar(dto: CriarPalletFrutaDto): Promise<PalletFruta> {
    QuantidadeVO.criar(dto.quantidadeCaixa);

    const pallet = await this.palletRepositorio.findOneBy({ id: dto.idPallet });
    if (!pallet) {
      throw new NotFoundException(`Pallet com ID ${dto.idPallet} não encontrado`);
    }

    const tipoFrutaEmbalagem = await this.tipoFrutaEmbalagemRepositorio.findOneBy({
      id: dto.idTipoFrutaEmbalagem,
    });
    if (!tipoFrutaEmbalagem) {
      throw new NotFoundException(
        `TipoFrutaEmbalagem com ID ${dto.idTipoFrutaEmbalagem} não encontrada`,
      );
    }

    const duplicata = await this.repositorio.findOneBy({
      idPallet: dto.idPallet,
      idTipoFrutaEmbalagem: dto.idTipoFrutaEmbalagem,
    });
    if (duplicata) {
      throw new ConflictException('Fruta já existe no pallet');
    }

    const palletFruta = this.repositorio.create({
      quantidadeCaixa: dto.quantidadeCaixa,
      idPallet: dto.idPallet,
      idTipoFrutaEmbalagem: dto.idTipoFrutaEmbalagem,
    });

    return this.repositorio.save(palletFruta);
  }
}
