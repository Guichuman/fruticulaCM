import {
  Body,
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateFrutasEmbalagenDto } from './dto/create-frutas-embalagen.dto';
import { UpdateFrutasEmbalagenDto } from './dto/update-frutas-embalagen.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Fruta } from 'src/fruta/entities/fruta.entity';
import { Repository } from 'typeorm';
import { Embalagem } from 'src/embalagem/entities/embalagem.entity';
import { FrutasEmbalagem } from './entities/frutas-embalagen.entity';

@Injectable()
export class FrutasEmbalagensService {
  constructor(
    @InjectRepository(Fruta)
    private readonly frutaRepository: Repository<Fruta>,
    @InjectRepository(Embalagem)
    private readonly embalagemRepository: Repository<Embalagem>,
    @InjectRepository(FrutasEmbalagem)
    private readonly frutasEmbalagemRepository: Repository<FrutasEmbalagem>,
  ) {}

  async create(@Body() createFrutasEmbalagensDto: CreateFrutasEmbalagenDto) {
    const fruta = await this.frutaRepository.findOneBy({
      id: createFrutasEmbalagensDto.frutaId,
    });

    if (!fruta) {
      throw new NotFoundException('Fruta não encontrada');
    }

    const embalagem = await this.embalagemRepository.findOneBy({
      id: createFrutasEmbalagensDto.embalagemId,
    });

    if (!embalagem) {
      throw new NotFoundException('Embalagem não encontrada');
    }

    const dadosFrutasEmbalagens = {
      peso: createFrutasEmbalagensDto.peso,
      sku: createFrutasEmbalagensDto.sku,
      tipo: createFrutasEmbalagensDto.tipo,
      fruta: fruta,
      embalagem: embalagem,
    };

    const novaFrutaEmbalagem = this.frutasEmbalagemRepository.create(
      dadosFrutasEmbalagens,
    );
    await this.frutasEmbalagemRepository.save(novaFrutaEmbalagem);

    return novaFrutaEmbalagem;
  }

  async findAll() {
    const frutasEmbalagem = await this.frutasEmbalagemRepository.find({
      relations: {
        fruta: true,
        embalagem: true,
      },
    });

    if (!frutasEmbalagem) {
      throw new NotFoundException('FrutasEmbalagens não encontrado');
    }

    return frutasEmbalagem;
  }

  async findOne(@Param('id', ParseIntPipe) id: number) {
    const frutasEmbalagem = await this.frutasEmbalagemRepository.find({
      where: { id },
      relations: { embalagem: true },
      select: {
        embalagem: {
          id: true,
          nome: true,
        },
      },
    });

    if (!frutasEmbalagem) {
      throw new NotFoundException('FrutasEmbalagens não encontrado');
    }

    return frutasEmbalagem;
  }

  async findEmbalagens(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Embalagem[]> {
    const frutasEmbalagem = await this.frutasEmbalagemRepository.find({
      where: { fruta: { id } },
      relations: { embalagem: true },
      select: {
        embalagem: {
          id: true,
          nome: true,
        },
        fruta: true,
      },
    });

    if (!frutasEmbalagem) {
      throw new NotFoundException('FrutasEmbalagens não encontrado');
    }

    return frutasEmbalagem.map((i) => i.embalagem);
  }

  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFrutasEmbalagens: UpdateFrutasEmbalagenDto,
  ) {
    const fruta = await this.frutaRepository.findOneBy({
      id: updateFrutasEmbalagens.frutaId,
    });

    if (!fruta) {
      throw new NotFoundException('Fruta não encontrada');
    }

    const embalagem = await this.embalagemRepository.findOneBy({
      id: updateFrutasEmbalagens.embalagemId,
    });

    if (!embalagem) {
      throw new NotFoundException('Embalagem não encontrada');
    }

    const dadosFrutasEmbalagens = {
      sku: updateFrutasEmbalagens.sku,
      peso: updateFrutasEmbalagens.peso,
      frutaId: updateFrutasEmbalagens.frutaId,
      embalagemId: updateFrutasEmbalagens.embalagemId,
      tipo: updateFrutasEmbalagens.tipo,
    };

    const frutasEmbalagem = await this.frutasEmbalagemRepository.preload({
      id,
      ...dadosFrutasEmbalagens,
    });

    if (!frutasEmbalagem) {
      throw new NotFoundException('FrutasEmbalagens não encontrada');
    }

    return this.frutasEmbalagemRepository.save(frutasEmbalagem);
  }

  async remove(@Param('id', ParseIntPipe) id: number) {
    const frutasEmbalagens = await this.frutasEmbalagemRepository.findOneBy({
      id,
    });

    if (!frutasEmbalagens) {
      throw new NotFoundException('FrutasEmbalagens não encontrada');
    }

    return await this.frutasEmbalagemRepository.remove(frutasEmbalagens);
  }
}
