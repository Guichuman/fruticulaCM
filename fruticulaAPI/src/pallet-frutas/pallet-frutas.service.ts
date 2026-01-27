import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePalletFrutaDto } from './dto/create-pallet-fruta.dto';
import { UpdatePalletFrutaDto } from './dto/update-pallet-fruta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PalletFruta } from './entities/pallet-fruta.entity';
import { Repository } from 'typeorm';
import { FrutasEmbalagem } from 'src/frutas-embalagens/entities/frutas-embalagen.entity';
import { Pallet } from 'src/pallet/entities/pallet.entity';

@Injectable()
export class PalletFrutasService {
  constructor(
    @InjectRepository(PalletFruta)
    private readonly palletFrutaRepo: Repository<PalletFruta>,

    @InjectRepository(FrutasEmbalagem)
    private readonly frutasEmbalagemRepo: Repository<FrutasEmbalagem>,

    @InjectRepository(Pallet)
    private readonly palletRepo: Repository<Pallet>,
  ) {}

  create(createPalletFrutaDto: CreatePalletFrutaDto) {
    return 'This action adds a new palletFruta';
  }

  async createPalletFruta(
    idFruta: number,
    idEmbalagem: number,
    quantidadeCaixa: number,
    idPallet: number,
  ): Promise<PalletFruta> {
    const frutaEmbalagem = await this.frutasEmbalagemRepo.findOne({
      where: { fruta: { id: idFruta }, embalagem: { id: idEmbalagem } },
    });

    if (!frutaEmbalagem) {
      throw new NotFoundException(
        'Combinação de fruta e embalagem não encontrada',
      );
    }

    const pallet = await this.palletRepo.findOne({ where: { id: idPallet } });

    if (!pallet) {
      throw new NotFoundException('Pallet não encontrado');
    }

    const palletFruta = this.palletFrutaRepo.create({
      quantidadeCaixa,
      idPallet,
      idFrutasEmbalagem: frutaEmbalagem.id,
    });

    return await this.palletFrutaRepo.save(palletFruta);
  }

  findAll() {
    return `This action returns all palletFrutas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} palletFruta`;
  }

  update(id: number, updatePalletFrutaDto: UpdatePalletFrutaDto) {
    return `This action updates a #${id} palletFruta`;
  }

  remove(id: number) {
    return `This action removes a #${id} palletFruta`;
  }
}
