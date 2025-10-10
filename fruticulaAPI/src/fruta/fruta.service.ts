import {
  Body,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateFrutaDto } from './dto/create-fruta.dto';
import { UpdateFrutaDto } from './dto/update-fruta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Fruta } from './entities/fruta.entity';
import { Repository } from 'typeorm';
import { FrutasEmbalagem } from 'src/frutas-embalagens/entities/frutas-embalagen.entity';

@Injectable()
export class FrutaService {
  constructor(
    @InjectRepository(Fruta)
    private readonly frutaRepository: Repository<Fruta>,
    @InjectRepository(FrutasEmbalagem)
    private readonly frutaEmbalagemRepository: Repository<FrutasEmbalagem>,
  ) {}

  async create(@Body() createFrutaDto: CreateFrutaDto) {
    try {
      const dadosFruta = {
        nome: createFrutaDto.nome,
        peso: createFrutaDto.peso,
        embalagem: createFrutaDto.embalagem,
        tipo: createFrutaDto.tipo,
        sku: createFrutaDto.sku,
      };

      const novaFruta = this.frutaRepository.create(dadosFruta);

      await this.frutaRepository.save(novaFruta);

      return novaFruta;
    } catch (error) {
      console.log('ERROR: ', error);
      throw new Error('Erro ao cadastrar fruta');
    }
  }

  async findAll() {
    const frutas = await this.frutaRepository.find();

    if (!frutas) {
      throw new NotFoundException('Frutas não encontradas');
    }

    return frutas;
  }

  async findOneWithEmbalagens(@Param('id', ParseIntPipe) id: number) {
    const fruta = await this.frutaRepository.findOne({
      where: { id },
      relations: {
        frutasEmbalagens: {
          embalagem: true,
        },
      },
    });

    if (!fruta) {
      throw new NotFoundException('Fruta não encontrada');
    }

    return fruta;
  }

  async findOne(@Param('id', ParseIntPipe) id: number) {
    const fruta = await this.frutaRepository.findOne({ where: { id } });

    if (!fruta) {
      throw new NotFoundException('Fruta não encontrada');
    }

    return fruta;
  }

  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFrutaDto: UpdateFrutaDto,
  ) {
    const dadosFruta = {
      nome: updateFrutaDto.nome,
      peso: updateFrutaDto.peso,
      embalagem: updateFrutaDto.embalagem,
      tipo: updateFrutaDto.tipo,
      sku: updateFrutaDto.sku,
    };

    const fruta = await this.frutaRepository.preload({
      id,
      ...dadosFruta,
    });

    if (!fruta) {
      throw new NotFoundException('Fruta não encontrada');
    }

    return this.frutaRepository.save(fruta);
  }

  async remove(@Param('id', ParseIntPipe) id: number) {
    const fruta = await this.frutaRepository.findOneBy({
      id,
    });

    if (!fruta) {
      throw new NotFoundException('Fruta não encontrada');
    }

    const frutasEmbalagens = await this.frutaEmbalagemRepository.find({
      where: {
        fruta: { id: fruta.id },
      },
    });

    if (frutasEmbalagens.length > 0) {
      throw new MethodNotAllowedException(
        'Existem embalagens contendo essa fruta, por favor, delete a embalagem primeiro.',
      );
    }
    return await this.frutaRepository.remove(fruta);
  }
}
