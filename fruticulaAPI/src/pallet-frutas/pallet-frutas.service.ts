import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePalletFrutaDto } from './dto/create-pallet-fruta.dto';
import { UpdatePalletFrutaDto } from './dto/update-pallet-fruta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PalletFruta } from './entities/pallet-fruta.entity';
import { Repository } from 'typeorm';
import { FrutasEmbalagem } from 'src/frutas-embalagens/entities/frutas-embalagen.entity';
import { Carga } from 'src/carga/entities/carga.entity';

@Injectable()
export class PalletFrutasService {
  constructor(
    @InjectRepository(PalletFruta)
    private readonly palletFrutaRepo: Repository<PalletFruta>,

    @InjectRepository(FrutasEmbalagem)
    private readonly frutasEmbalagemRepo: Repository<FrutasEmbalagem>,

    @InjectRepository(FrutasEmbalagem)
    private readonly cargaRepo: Repository<Carga>,
  ) {}

  create(createPalletFrutaDto: CreatePalletFrutaDto) {
    return 'This action adds a new palletFruta';
  }

  async createPalletFruta(
    idFruta: number,
    idEmbalagem: number,
    quantidadeCaixa: number,
    idCarga: number,
  ): Promise<PalletFruta> {
    const frutaEmbalagem = await this.frutasEmbalagemRepo.findOne({
      where: { fruta: { id: idFruta }, embalagem: { id: idEmbalagem } },
    });

    if (!frutaEmbalagem) {
      throw new NotFoundException(
        'Combinação de fruta e embalagem não encontrada',
      );
    }

    const carga = await this.cargaRepo.findOne({ where: { id: idCarga } });

    if (!carga) {
      throw new NotFoundException('Carga não encontrada');
    }

    const palletFruta = this.palletFrutaRepo.create({
      quantidadeCaixa,
      frutasEmbalagem: frutaEmbalagem,
      carga,
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
